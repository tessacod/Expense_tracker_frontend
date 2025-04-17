

//----------------------------------------------------------------------------

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user',
  standalone: true, 
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class NewUserComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      job: ['', Validators.required],
      dob: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  ngOnInit(): void {}
  
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const userData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      age: this.registerForm.value.age,
      job: this.registerForm.value.job,
      dob: this.registerForm.value.dob
    };
    
    this.authService.register(userData).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Registration successful!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      }
    );
  }
  
  get formControls() {
    return this.registerForm.controls;
  }
}