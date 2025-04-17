


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; 
interface AuthResponse {
  user: User;
  token: string;
  message?: string;
  success?: boolean;
}
interface User {
  id: string;
  name: string;
  age?: number;
  job?: string;
  username: string;
  email?: string;
  dob?: string;


}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  private apiUrl = environment.apiUrl;
  //private apiUrl = 'http://localhost:3001'; // Update with your API URL
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  public redirectUrl: string = ''; // Add redirect URL property

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('user') || 'null')
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  // register(userData: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/users/register`, userData)  }
// Fixed register method to handle user data and token properly
register(userData: any): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, userData)
    .pipe(map(response => {
      // Store user data and token on successful registration
      if (response && response.user && response.token) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.userSubject.next(response.user);
      }
      return response;
    }));
}

    login(email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/users/login`, { email: email, password })
        .pipe(map(response => {
          // Make sure the token is being stored properly
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.userSubject.next(response.user);
          return response;
        }));
    }


 




 // Add the missing getUserProfile method
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }


  // Fixed - Do not manually set headers, let interceptor handle it
  updateUserProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile`, userData)
      .pipe(map(response => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        }
        return response;
      }));
  }


  

 


  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    // Use direct route instead of nested route
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // Fixed the logic issue - don't have two return statements
    // Return true if both user and token exist
    return !!this.userValue && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}




