import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isLoggedIn = false;
  userName = '';

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Subscribe to auth changes to update layout accordingly
    this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.name || '';
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}