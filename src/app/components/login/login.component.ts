import { Component } from '@angular/core';
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
export class LoginComponent {
  empCode: string = '';
  site: string = '';
  isLoading: boolean = false;
  locationStatus: string = '';
  showLocationInfo: boolean = false;
  userLocation: UserLocation | null = null;
  errorMessage: string = '';
  
  // Manual location input - always enabled
  manualLatitude: string = '-5.104556'; // Default dari contoh API
  manualLongitude: string = '119.506595';
  
  // Auto-detected location (hanya untuk informasi)
  autoDetectedLocation: UserLocation | null = null;
  showAutoLocation: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private geolocationService: GeolocationService
  ) {}

  async onLogin() {
    // Reset error message
    this.errorMessage = '';

    // Validasi input
    if (!this.empCode.trim()) {
      this.errorMessage = 'Silakan masukkan kode karyawan Anda';
      return;
    }

    if (!this.site.trim()) {
      this.errorMessage = 'Silakan masukkan kode site';
      return;
    }

    // Validasi manual location (always required now)
    if (!this.manualLatitude || !this.manualLongitude || 
        this.manualLatitude.toString().trim() === '' || 
        this.manualLongitude.toString().trim() === '') {
      this.errorMessage = 'Silakan masukkan latitude dan longitude';
      return;
    }
    
    const lat = parseFloat(this.manualLatitude.toString().trim());
    const lng = parseFloat(this.manualLongitude.toString().trim());
    
    if (isNaN(lat) || isNaN(lng)) {
      this.errorMessage = 'Silakan masukkan koordinat numerik yang valid';
      return;
    }
    
    if (lat < -90 || lat > 90) {
      this.errorMessage = 'Latitude harus antara -90 dan 90';
      return;
    }
    
    if (lng < -180 || lng > 180) {
      this.errorMessage = 'Longitude harus antara -180 dan 180';
      return;
    }

    this.isLoading = true;
    this.locationStatus = 'Login dengan lokasi khusus...';

    try {
      // Login dengan API menggunakan manual location
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
        this.locationStatus = 'Login berhasil! Mengalihkan...';
        this.showLocationInfo = true;
        
        // Update user location untuk display
        if (result.user?.location) {
          this.userLocation = result.user.location;
        }
        
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
      this.errorMessage = 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
      console.error('Login error:', error);
    }
  }

  async getLocationOnly() {
    this.isLoading = true;
    this.locationStatus = 'Mendeteksi lokasi Anda saat ini...';
    this.errorMessage = '';
    this.showAutoLocation = false;

    try {
      // Deteksi lokasi otomatis
      const detectedLocation = await this.geolocationService.getCurrentLocation();
      
      this.autoDetectedLocation = detectedLocation;
      this.locationStatus = 'Lokasi terdeteksi berhasil!';
      this.showAutoLocation = true;
      
      console.log('Auto-detected location:', detectedLocation);
      
    } catch (error) {
      this.locationStatus = '';
      this.errorMessage = 'Tidak dapat mendeteksi lokasi. Pastikan akses lokasi diizinkan.';
      console.error('Location detection error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Fungsi untuk copy koordinat auto-detected ke input manual
  useDetectedLocation() {
    if (this.autoDetectedLocation) {
      this.manualLatitude = this.autoDetectedLocation.latitude.toFixed(6);
      this.manualLongitude = this.autoDetectedLocation.longitude.toFixed(6);
      this.errorMessage = '';
      alert('Koordinat lokasi disalin ke field input!');
    }
  }

  // Fungsi untuk menyembunyikan info auto location
  hideAutoLocation() {
    this.showAutoLocation = false;
    this.autoDetectedLocation = null;
    this.locationStatus = '';
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Disalin ke clipboard!');
    }).catch(() => {
      alert('Gagal menyalin ke clipboard');
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

  // Validate coordinates
  onCoordinateChange() {
    this.errorMessage = '';
  }
}
