import { Injectable } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  // Supported barcode formats including 1D barcodes (barcode garis)
  public allowedFormats = [
    BarcodeFormat.CODE_128,    // Standard barcode format
    BarcodeFormat.CODE_39,     // Code 39 barcode
    BarcodeFormat.EAN_13,      // EAN-13 barcode
    BarcodeFormat.EAN_8,       // EAN-8 barcode
    BarcodeFormat.UPC_A,       // UPC-A barcode
    BarcodeFormat.UPC_E,       // UPC-E barcode
    BarcodeFormat.CODABAR,     // Codabar barcode
    BarcodeFormat.ITF,         // Interleaved 2 of 5
    BarcodeFormat.QR_CODE,     // QR Code (2D)
    BarcodeFormat.DATA_MATRIX, // Data Matrix (2D)
    BarcodeFormat.PDF_417      // PDF417 (2D)
  ];

  public hasDevices = false;
  public hasPermission = false;
  public availableDevices: MediaDeviceInfo[] = [];

  constructor() {}

  async checkCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      this.hasPermission = true;
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      this.hasPermission = false;
      return false;
    }
  }

  async getVideoDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableDevices = devices.filter(device => device.kind === 'videoinput');
      this.hasDevices = this.availableDevices.length > 0;
      return this.availableDevices;
    } catch (error) {
      console.error('Error getting video devices:', error);
      return [];
    }
  }

  getPreferredCamera(): MediaDeviceInfo | undefined {
    if (this.availableDevices.length === 0) return undefined;

    // Try to find back camera first (better for barcode scanning)
    const backCamera = this.availableDevices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('environment')
    );

    if (backCamera) return backCamera;

    // If no back camera, return the first available camera
    return this.availableDevices[0];
  }

  validateBarcode(code: string): boolean {
    // Basic validation for truck barcode format
    if (!code) return false;
    
    // Allow various formats:
    // - TRK-XXXX (truck format)
    // - Any alphanumeric code with at least 3 characters
    // - Numbers only (for simple barcodes)
    const patterns = [
      /^TRK-\d{4,}$/i,           // TRK-1234 format
      /^[A-Z0-9]{3,}$/i,         // General alphanumeric
      /^\d{3,}$/,                // Numbers only
      /^[A-Z]{2,3}-\d{3,}$/i     // XX-123 or XXX-123 format
    ];

    return patterns.some(pattern => pattern.test(code));
  }

  formatBarcode(code: string): string {
    // Clean and format the barcode
    const cleaned = code.trim().toUpperCase();
    
    // If it's just numbers and length > 4, format as TRK-XXXX
    if (/^\d{4,}$/.test(cleaned)) {
      return `TRK-${cleaned}`;
    }
    
    return cleaned;
  }
}
