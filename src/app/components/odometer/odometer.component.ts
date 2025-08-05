import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-odometer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './odometer.component.html',
  styleUrls: ['./odometer.component.css']
})
export class OdometerComponent implements OnInit {
  truckBarcode: string = '';
  tripType: string = '';
  odometerReading: string = '';
  driverName: string = '';
  notes: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.truckBarcode = localStorage.getItem('currentTruckBarcode') || '';
    this.tripType = localStorage.getItem('tripType') || '';
    
    if (!this.truckBarcode || !this.tripType) {
      this.router.navigate(['/trip-selection']);
    }
  }

  onSubmit() {
    if (this.odometerReading && this.driverName) {
      // Save trip data
      const tripData = {
        truckBarcode: this.truckBarcode,
        tripType: this.tripType,
        odometerReading: this.odometerReading,
        driverName: this.driverName,
        notes: this.notes,
        timestamp: new Date().toISOString(),
        checklistData: this.tripType === 'OUT' ? localStorage.getItem('checklistData') : null
      };
      
      // Save to localStorage (in real app, would send to server)
      const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]');
      existingTrips.push(tripData);
      localStorage.setItem('trips', JSON.stringify(existingTrips));
      
      // Clean up temporary data
      localStorage.removeItem('currentTruckBarcode');
      localStorage.removeItem('tripType');
      localStorage.removeItem('checklistData');
      
      this.router.navigate(['/trip-complete']);
    } else {
      alert('Please fill in all required fields');
    }
  }

  goBack() {
    if (this.tripType === 'OUT') {
      this.router.navigate(['/checklist']);
    } else {
      this.router.navigate(['/trip-selection']);
    }
  }
}
