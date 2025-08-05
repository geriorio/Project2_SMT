import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  private isFullscreenSubject = new BehaviorSubject<boolean>(false);
  public isFullscreen$ = this.isFullscreenSubject.asObservable();

  constructor() {
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreenSubject.next(!!document.fullscreenElement);
    });
  }

  async toggleFullscreen(): Promise<void> {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }

  async enterFullscreen(): Promise<void> {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }

  async exitFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }

  get isFullscreen(): boolean {
    return !!document.fullscreenElement;
  }
}
