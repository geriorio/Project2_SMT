import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-selection.component.html',
  styleUrls: ['./trip-selection.component.css']
})
export class TripSelectionComponent implements OnInit {
  truckBarcode: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.truckBarcode = localStorage.getItem('currentTruckBarcode') || '';
    if (!this.truckBarcode) {
      this.router.navigate(['/scan-barcode']);
    }
  }

  selectTripType(type: 'IN' | 'OUT') {
    localStorage.setItem('tripType', type);
    
    // Generate trip number based on truck and timestamp
    const tripNumber = `${this.truckBarcode}-${Date.now()}`;
    localStorage.setItem('tripNumber', tripNumber);
    
    if (type === 'OUT') {
      // For OUT trips, go to checklist first
      this.router.navigate(['/checklist']);
    } else {
      // For IN trips, go directly to odometer
      this.router.navigate(['/odometer']);
    }
  }

  goBack() {
    this.router.navigate(['/scan-barcode']);
  }
}
