import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scan-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-barcode.component.html',
  styleUrls: ['./scan-barcode.component.css']
})
export class ScanBarcodeComponent {
  barcodeInput: string = '';
  isScanning: boolean = false;

  constructor(private router: Router) {}

  startScan() {
    this.isScanning = true;
    // Simulate scanning process
    setTimeout(() => {
      this.barcodeInput = 'TRK-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.isScanning = false;
    }, 2000);
  }

  onSubmit() {
    if (this.barcodeInput) {
      // Store barcode data and navigate to trip selection
      localStorage.setItem('currentTruckBarcode', this.barcodeInput);
      this.router.navigate(['/trip-selection']);
    } else {
      alert('Please scan or enter a barcode');
    }
  }

  goBack() {
    this.router.navigate(['/landing']);
  }
}
