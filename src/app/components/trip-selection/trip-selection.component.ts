import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripInfo } from '../../services/api.service';

@Component({
  selector: 'app-trip-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-selection.component.html',
  styleUrls: ['./trip-selection.component.css']
})
export class TripSelectionComponent implements OnInit {
  truckBarcode: string = '';
  tripData: TripInfo | null = null;
  hasTripData: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.truckBarcode = localStorage.getItem('currentTruckBarcode') || '';
    if (!this.truckBarcode) {
      this.router.navigate(['/scan-barcode']);
      return;
    }

    // Check if we have trip data from API
    const tripDataString = localStorage.getItem('currentTripData');
    if (tripDataString) {
      try {
        this.tripData = JSON.parse(tripDataString);
        this.hasTripData = true;
        console.log('Trip data loaded:', this.tripData);
      } catch (error) {
        console.error('Error parsing trip data:', error);
        this.hasTripData = false;
      }
    } else {
      this.hasTripData = false;
      console.log('No trip data available - manual mode');
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
