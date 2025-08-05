import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { GeolocationService } from '../services/geolocation.service';

export const geofenceGuard: CanActivateFn = async (route, state) => {
  const geolocationService = inject(GeolocationService);
  const router = inject(Router);

  try {
    const locationValidation = await geolocationService.validateLocationForLogin();
    
    if (locationValidation.success) {
      return true;
    } else {
      // Redirect ke login dengan pesan error
      router.navigate(['/login'], { 
        queryParams: { 
          error: 'location_denied',
          message: locationValidation.message 
        } 
      });
      return false;
    }
  } catch (error) {
    // Jika ada error dalam mengakses lokasi, redirect ke login
    router.navigate(['/login'], { 
      queryParams: { 
        error: 'location_error',
        message: 'Unable to access location services' 
      } 
    });
    return false;
  }
};
