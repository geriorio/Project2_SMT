import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-complete.component.html',
  styleUrls: ['./trip-complete.component.css']
})
export class TripCompleteComponent {
  
  constructor(private router: Router) {}

  startNewTrip() {
    this.router.navigate(['/scan-barcode']);
  }

  goToLanding() {
    this.router.navigate(['/landing']);
  }
}
