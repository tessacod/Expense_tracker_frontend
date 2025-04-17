
//==============================================================================
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && this.router.url === '/login') {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() { 
    return this.loginForm.controls as { [key: string]: AbstractControl }; 
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Using only the login method with email and password
    this.authService.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: (res) => {
        console.log('Login success', res);
        // Check if redirectUrl is defined in the service before using it
        // Using optional chaining to safely access the property
        const redirectUrl = '/dashboard'; // Default fallback
        this.router.navigate([redirectUrl]);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}