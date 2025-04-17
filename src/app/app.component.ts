






// app.component.ts
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';
import { InactivityService } from './service/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    RouterModule
  ]
})
export class AppComponent implements OnInit {
  sidebarOpen = false;
  currentUrl: string = '';
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  constructor(
    private router: Router,
    private inactivityService: InactivityService
  ) {
    // when to show navigation
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentUrl = event.url;
    });
  }
  
  ngOnInit(): void {
    
    if (this.isLoggedIn() && this.isAuthPage()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Check if current page is login or register
  isAuthPage(): boolean {
    return this.currentUrl.toLowerCase().includes('/login') || 
           this.currentUrl.toLowerCase().includes('/new-user') ||
           this.currentUrl === '/';  // d show login
  }
  
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout() {
    // Clear token or other auth data
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}