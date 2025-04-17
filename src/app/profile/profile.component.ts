import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit  {

  userData: any = null;
  user: any = null;  // Add this property
  loading: boolean = true;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      // As a fallback, get the user from local storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    this.loadUserProfile();
  }

 



  loadUserProfile(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.getUserProfile().subscribe(
      (response: any) => {
        console.log('Profile data received:', response);
        this.userData = response;
        
        if (response.user) {
          this.user = response.user;
        } else if (response) {
          // If the response structure is different
          this.user = response;
        }
        
        this.loading = false;
      },
      (error) => {
        console.error('Profile error:', error);
        this.error = `Failed to load profile: ${error.status} ${error.statusText}`;
        this.loading = false;
      }
    );
  }
  
   // Add this method to handle navigation
   navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}