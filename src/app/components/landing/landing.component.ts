import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  currentTime: string = '';
  currentUser: string = 'Admin User';

  constructor(private router: Router) {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleString();
  }

  goToScanBarcode() {
    this.router.navigate(['/scan-barcode']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
