import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeolocationService, UserLocation } from '../../services/geolocation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  locationStatus: string = '';
  showLocationInfo: boolean = false;
  userLocation: UserLocation | null = null;

  constructor(
    private router: Router,
    private geolocationService: GeolocationService
  ) {}

  async onLogin() {
    // Validasi input
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }

    // Validasi kredensial (contoh sederhana)
    if (!this.validateCredentials(this.username, this.password)) {
      alert('Invalid username or password');
      return;
    }

    this.isLoading = true;
    this.locationStatus = 'Getting your location...';

    try {
      // Dapatkan lokasi saat ini
      this.userLocation = await this.geolocationService.getCurrentLocation();
      this.locationStatus = 'Location detected successfully!';
      
      // Tampilkan informasi lokasi sebentar sebelum redirect
      this.showLocationInfo = true;
      
      // Login berhasil - redirect setelah 2 detik
      setTimeout(() => {
        this.router.navigate(['/landing']);
      }, 2000);
      
    } catch (error) {
      this.isLoading = false;
      this.locationStatus = 'Error accessing location';
      console.error('Geolocation error:', error);
      alert('Unable to access your location. Please enable location services and try again.');
    }
  }

  private validateCredentials(username: string, password: string): boolean {
    // Implementasi validasi kredensial sederhana
    const validUsers = [
      { username: 'driver1', password: 'pass123' },
      { username: 'driver2', password: 'pass456' },
      { username: 'supervisor', password: 'admin123' },
      { username: 'admin', password: 'admin' }
    ];

    return validUsers.some(user => 
      user.username === username && user.password === password
    );
  }

  async getLocationOnly() {
    this.isLoading = true;
    this.locationStatus = 'Getting your current location...';

    try {
      this.userLocation = await this.geolocationService.getCurrentLocation();
      this.locationStatus = 'Location detected successfully!';
      this.showLocationInfo = true;
    } catch (error) {
      this.locationStatus = 'Error accessing location';
      console.error('Geolocation error:', error);
      alert('Unable to access your location. Please enable location services and try again.');
    } finally {
      this.isLoading = false;
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  }

  hideLocationInfo() {
    this.showLocationInfo = false;
    this.locationStatus = '';
    this.userLocation = null;
  }

  // Fungsi untuk format koordinat
  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }

  // Demo credentials helper
  fillDemoCredentials(type: 'driver' | 'supervisor' | 'admin') {
    switch (type) {
      case 'driver':
        this.username = 'driver1';
        this.password = 'pass123';
        break;
      case 'supervisor':
        this.username = 'supervisor';
        this.password = 'admin123';
        break;
      case 'admin':
        this.username = 'admin';
        this.password = 'admin';
        break;
    }
  }
}
