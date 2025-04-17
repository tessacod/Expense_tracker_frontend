import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../service/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,HttpClientModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  categories: string[] = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Housing',
    'Utilities',
    'Healthcare',
    'Personal',
    'Education',
    'Shopping',
    'Travel',
    'Gifts & Donations',
    'Other'
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.expenseForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', [Validators.required]],
      description: ['']
    });
  }
  
  get form() {
    return this.expenseForm.controls;
  }
  
  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const expenseData = {
      category: this.form['category'].value,
amount: parseFloat(this.form['amount'].value),
date: this.form['date'].value,
description: this.form['description'].value || ''
 
    };
    
    this.expenseService.addExpense(expenseData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Expense added successfully!';
        this.expenseForm.reset();
        
        setTimeout(() => {
          this.router.navigate(['/expense/list']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Failed to add expense. Please try again.';
      }
    });
  }
}  

