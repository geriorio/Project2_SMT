import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeolocationService, UserLocation, GeofenceLocation } from './geolocation.service';

export interface AuthUser {
  username: string;
  role: string;
  loginTime: Date;
  location?: UserLocation;
  allowedLocation?: GeofenceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'smt_auth_user';

  constructor(private geolocationService: GeolocationService) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  /**
   * Login dengan validasi geofence
   */
  async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    // Validasi kredensial
    const user = this.validateCredentials(username, password);
    if (!user) {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }

    // Validasi lokasi
    try {
      const locationValidation = await this.geolocationService.validateLocationForLogin();
      
      if (!locationValidation.success) {
        return {
          success: false,
          message: locationValidation.message
        };
      }

      // Login berhasil
      const authUser: AuthUser = {
        username: user.username,
        role: user.role,
        loginTime: new Date(),
        location: locationValidation.location,
        allowedLocation: locationValidation.nearestLocation
      };

      this.setCurrentUser(authUser);
      this.saveUserToStorage(authUser);

      return {
        success: true,
        message: `Login successful at ${locationValidation.nearestLocation?.name}`,
        user: authUser
      };

    } catch (error) {
      return {
        success: false,
        message: `Location access error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Validasi ulang lokasi untuk user yang sudah login
   */
  async revalidateLocation(): Promise<{ success: boolean; message: string }> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'No user logged in'
      };
    }

    try {
      const locationValidation = await this.geolocationService.validateLocationForLogin();
      
      if (locationValidation.success) {
        // Update user location
        const updatedUser: AuthUser = {
          ...currentUser,
          location: locationValidation.location,
          allowedLocation: locationValidation.nearestLocation
        };
        
        this.setCurrentUser(updatedUser);
        this.saveUserToStorage(updatedUser);
        
        return {
          success: true,
          message: `Location verified at ${locationValidation.nearestLocation?.name}`
        };
      } else {
        // Logout user jika lokasi tidak valid
        this.logout();
        return {
          success: false,
          message: locationValidation.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Location validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Validasi kredensial (implementasi sederhana)
   */
  private validateCredentials(username: string, password: string): { username: string; role: string } | null {
    const validUsers = [
      { username: 'driver1', password: 'pass123', role: 'driver' },
      { username: 'driver2', password: 'pass456', role: 'driver' },
      { username: 'supervisor', password: 'admin123', role: 'supervisor' },
      { username: 'admin', password: 'admin', role: 'admin' }
    ];

    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      return {
        username: user.username,
        role: user.role
      };
    }
    
    return null;
  }

  /**
   * Set current user
   */
  private setCurrentUser(user: AuthUser): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: AuthUser): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        const user: AuthUser = JSON.parse(storedUser);
        // Check if login is still valid (e.g., not expired)
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        // Auto logout after 8 hours
        if (hoursSinceLogin < 8) {
          this.setCurrentUser(user);
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout();
    }
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}
