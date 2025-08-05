import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentLocationSubject = new BehaviorSubject<UserLocation | null>(null);
  public currentLocation$ = this.currentLocationSubject.asObservable();

  constructor() { }

  /**
   * Mendapatkan lokasi pengguna saat ini
   */
  getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 detik timeout
        maximumAge: 60000 // Cache selama 1 menit
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.currentLocationSubject.next(userLocation);
          resolve(userLocation);
        },
        (error) => {
          let errorMessage = 'Unknown error occurred';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Watch position secara real-time (opsional)
   */
  watchPosition(): Observable<UserLocation> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.currentLocationSubject.next(userLocation);
          observer.next(userLocation);
        },
        (error) => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );

      // Cleanup function
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    });
  }
}
