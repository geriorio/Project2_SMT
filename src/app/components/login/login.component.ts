import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GeolocationService, UserLocation } from '../../services/geolocation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  empCode: string = '';
  site: string = '';
  isLoading: boolean = false;
  locationStatus: string = '';
  errorMessage: string = '';
  
  // Current location coordinates (read-only display)
  manualLatitude: string = '-5.104556'; // Default fallback
  manualLongitude: string = '119.506595';

  constructor(
    private router: Router,
    private authService: AuthService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit() {
    // Automatically get current location when component loads
    this.getCurrentLocationOnInit();
  }

  async getCurrentLocationOnInit() {
    this.isLoading = true;
    this.locationStatus = 'Detecting your current location...';
    this.errorMessage = '';

    try {
      // Auto-detect location and set coordinates
      const currentLocation = await this.geolocationService.getCurrentLocation();
      
      this.manualLatitude = currentLocation.latitude.toFixed(6);
      this.manualLongitude = currentLocation.longitude.toFixed(6);
      this.locationStatus = 'Location detected successfully!';
      
      console.log('Current location set:', currentLocation);
      
    } catch (error) {
      this.locationStatus = '';
      this.errorMessage = 'Unable to detect location. Please ensure location access is enabled and refresh the page.';
      console.error('Location detection error:', error);
      
      // Keep default coordinates if location detection fails
      this.manualLatitude = '-5.104556';
      this.manualLongitude = '119.506595';
    } finally {
      this.isLoading = false;
    }
  }

  async onLogin() {
    // Reset error message
    this.errorMessage = '';

    // Validasi input
    if (!this.empCode.trim()) {
      this.errorMessage = 'Please enter your employee code';
      return;
    }

    if (!this.site.trim()) {
      this.errorMessage = 'Isi Kode Cabang!';
      return;
    }

    // Validasi manual location (always required now)
    if (!this.manualLatitude || !this.manualLongitude || 
        this.manualLatitude.toString().trim() === '' || 
        this.manualLongitude.toString().trim() === '') {
      this.errorMessage = 'Please enter both latitude and longitude';
      return;
    }
    
    const lat = parseFloat(this.manualLatitude.toString().trim());
    const lng = parseFloat(this.manualLongitude.toString().trim());
    
    if (isNaN(lat) || isNaN(lng)) {
      this.errorMessage = 'Please enter valid numeric coordinates';
      return;
    }
    
    if (lat < -90 || lat > 90) {
      this.errorMessage = 'Latitude must be between -90 and 90';
      return;
    }
    
    if (lng < -180 || lng > 180) {
      this.errorMessage = 'Longitude must be between -180 and 180';
      return;
    }

    this.isLoading = true;
    this.locationStatus = 'Logging in with current position...';

    try {
      // Login dengan API menggunakan current location
      const result = await this.authService.loginWithLocation(
        this.empCode.trim(), 
        this.site.trim(),
        {
          latitude: lat,
          longitude: lng,
          accuracy: 0,
          timestamp: Date.now()
        }
      );
      
      if (result.success) {
        this.locationStatus = 'Login successful! Redirecting...';
        
        // Redirect setelah 2 detik
        setTimeout(() => {
          this.router.navigate(['/landing']);
        }, 2000);
        
      } else {
        this.isLoading = false;
        this.locationStatus = '';
        this.errorMessage = result.message;
      }
      
    } catch (error) {
      this.isLoading = false;
      this.locationStatus = '';
      this.errorMessage = 'An unexpected error occurred. Please try again.';
      console.error('Login error:', error);
    }
  }

  // Handle site input
  onSiteChange() {
    // Reset error message when site changes
    this.errorMessage = '';
  }

  // Handle employee code input
  onEmpCodeChange() {
    // Reset error message when employee code changes
    this.errorMessage = '';
  }

  // Format coordinate display
  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }
}
