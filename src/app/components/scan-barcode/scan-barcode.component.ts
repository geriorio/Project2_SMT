import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { BarcodeService } from '../../services/barcode.service';
import { ApiService, TripInfo } from '../../services/api.service';

@Component({
  selector: 'app-scan-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-barcode.component.html',
  styleUrls: ['./scan-barcode.component.css']
})
export class ScanBarcodeComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  
  barcodeInput: string = '';
  isScanning: boolean = false;
  hasCamera: boolean = false;
  cameraError: string = '';
  isLoadingTripData: boolean = false;
  tripDataError: string = '';
  
  private codeReader: BrowserMultiFormatReader;
  private stream: MediaStream | null = null;

  constructor(
    private router: Router,
    private barcodeService: BarcodeService,
    private apiService: ApiService
  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }

  ngOnInit() {
    this.checkCameraAvailability();
  }

  ngOnDestroy() {
    this.stopScanning();
  }

  async checkCameraAvailability() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!this.hasCamera) {
        this.cameraError = 'No camera found on this device';
      }
    } catch (error) {
      console.error('Error checking camera:', error);
      this.cameraError = 'Unable to access camera permissions';
      this.hasCamera = false;
    }
  }

  async startScan() {
    if (!this.hasCamera) {
      alert('Camera not available. Please use manual input.');
      return;
    }

    try {
      this.isScanning = true;
      this.cameraError = '';

      // Get camera stream with optimized settings for barcode scanning
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280, min: 640 }, // Higher resolution for better detection
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 } // Smooth frame rate
        }
      });

      // Set video stream
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          this.videoElement.nativeElement.onloadedmetadata = resolve;
        });
        
        // Start scanning with enhanced detection
        this.codeReader.decodeFromVideoDevice(
          null, // Use default camera
          this.videoElement.nativeElement,
          (result: Result | null, error?: any) => {
            if (result) {
              const detectedText = result.getText();
              console.log('Raw barcode detected:', detectedText);
              
              // Validate barcode before accepting
              if (this.validateDetectedBarcode(detectedText)) {
                this.onBarcodeDetected(detectedText);
              } else {
                console.log('Invalid barcode format, continuing scan:', detectedText);
              }
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('Scan error:', error);
            }
          }
        );
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      this.cameraError = 'Unable to start camera. Please check permissions and lighting.';
      this.isScanning = false;
    }
  }

  stopScanning() {
    this.isScanning = false;
    
    // Stop code reader
    this.codeReader.reset();
    
    // Stop camera stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Clear video element
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  validateDetectedBarcode(code: string): boolean {
    // Use BarcodeService validation which is more comprehensive
    return this.barcodeService.validateBarcode(code);
  }

  formatDetectedBarcode(code: string): string {
    // Use BarcodeService formatting
    return this.barcodeService.formatBarcode(code);
  }

  onBarcodeDetected(barcode: string) {
    console.log('Valid barcode detected:', barcode);
    
    // Format the barcode
    const formattedBarcode = this.formatDetectedBarcode(barcode);
    this.barcodeInput = formattedBarcode;
    
    // Stop scanning
    this.stopScanning();
    
    // Show success feedback
    this.showScanSuccess();
    
    // Auto-submit after successful scan with small delay
    setTimeout(() => {
      this.onSubmit();
    }, 1500);
  }

  showScanSuccess() {
    // Add visual feedback for successful scan
    const scanFrame = document.querySelector('.scanner-frame');
    if (scanFrame) {
      scanFrame.classList.add('scan-success');
      setTimeout(() => {
        scanFrame.classList.remove('scan-success');
      }, 1500);
    }
  }

  onSubmit() {
    if (this.barcodeInput.trim()) {
      this.getTripDataFromAPI(this.barcodeInput.trim());
    } else {
      alert('Please scan or enter a barcode');
    }
  }

  /**
   * Get trip data from API using the scanned/entered code
   */
  getTripDataFromAPI(tripCode: string) {
    this.isLoadingTripData = true;
    this.tripDataError = '';

    console.log('Getting trip data for:', tripCode);

    this.apiService.getTripData(tripCode).subscribe({
      next: (tripData: TripInfo) => {
        console.log('Trip data received:', tripData);
        
        // Store trip data and barcode in localStorage
        localStorage.setItem('currentTruckBarcode', tripCode);
        localStorage.setItem('currentTripData', JSON.stringify(tripData));
        
        this.isLoadingTripData = false;
        
        // Navigate to trip selection page with trip data
        this.router.navigate(['/trip-selection']);
      },
      error: (error) => {
        console.error('Error getting trip data:', error);
        this.isLoadingTripData = false;
        
        let errorMessage = 'Failed to get trip data.';
        
        if (error.status === 0) {
          errorMessage += ' Please check your internet connection.';
        } else if (error.status === 401) {
          errorMessage += ' Authentication failed.';
        } else if (error.status === 403) {
          errorMessage += ' Access denied.';
        } else if (error.status === 404) {
          errorMessage += ' Trip not found or API endpoint not available.';
        } else if (error.status >= 500) {
          errorMessage += ' Server error.';
        } else {
          errorMessage += ` (HTTP ${error.status})`;
        }
        
        this.tripDataError = errorMessage;
        
        // Show error but still allow manual proceed
        const proceedManually = confirm(
          `${errorMessage}\n\nWould you like to proceed manually without trip data?`
        );
        
        if (proceedManually) {
          // Store barcode without trip data
          localStorage.setItem('currentTruckBarcode', tripCode);
          localStorage.removeItem('currentTripData'); // Clear any old trip data
          this.router.navigate(['/trip-selection']);
        }
      }
    });
  }

  goBack() {
    this.stopScanning();
    this.router.navigate(['/landing']);
  }
}
