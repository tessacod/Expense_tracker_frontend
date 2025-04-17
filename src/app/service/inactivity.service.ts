import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService implements OnDestroy {
  private timeout: any;
  private readonly TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.resetTimer();
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    // Monitor user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    if (this.authService.isLoggedIn()) {
      this.timeout = setTimeout(() => {
        this.logout();
      }, this.TIMEOUT_DURATION);
    }
  }

  private logout(): void {
    // Call your auth service logout method
    this.authService.logout();
    // Navigate to login page
    this.router.navigate(['/auth/login']);
    // Optionally display a message to the user about auto-logout
    alert('You have been logged out due to inactivity');
  }

  ngOnDestroy(): void {
    // Clean up when service is destroyed
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.removeEventListener(event, () => this.resetTimer());
    });
  }
}