
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../service/expense.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditExpenseComponent implements OnInit, OnDestroy {
  expenseForm!: FormGroup;
  
  expenseId: string = '';  // Changed to string with empty default to avoid null
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  isUpdating = true;  // Flag to track if we're updating or creating
  private subscriptions: Subscription[] = [];
  
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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    console.log('EditExpenseComponent initialized');
    
    // Initialize form first
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      category: ['', Validators.required]
    });
    
    // Parse URL and extract expense data
    this.parseUrlAndExtractExpenseData();
  }
  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  parseUrlAndExtractExpenseData(): void {
    // Get the full URL for parsing
    const url = window.location.href;
    console.log('Current URL:', url);
    
    // Try to extract ID from various parts of the URL
    let extractedId = this.extractIdFromUrl(url);
    
    // Extract expense details from URL parameters
    const expense = this.extractExpenseDetailsFromUrl(url);
    
    // Determine if we should treat this as an update or create
    if (extractedId && extractedId !== 'undefined') {
      // We have a valid ID, use it
      this.expenseId = extractedId;
      this.isUpdating = true;
      
      // If we have expense details in the URL, use them
      if (expense) {
        this.populateFormFromExpenseData(expense);
      } else {
        // Otherwise load from service
        this.loadExpenseDetails();
      }
    } else if (expense) {
      // We have expense details but no valid ID
      // For update-only approach, we need to show appropriate message
      this.errorMessage = 'Unable to update: No valid expense ID found';
      
      // Still populate the form to show the data
      this.populateFormFromExpenseData(expense);
      this.isUpdating = false;
    } else {
      // No ID and no expense details
      this.errorMessage = 'No expense details provided';
      this.isUpdating = false;
    }
  }
  
  extractIdFromUrl(url: string): string {
    // Try different patterns to extract the ID
    // Pattern 1: /expense/edit/<id>
    let match = url.match(/\/expense\/edit\/([^\/\?;]+)/);
    if (match && match[1]) return match[1];
    
    // Pattern 2: edit;_id=<id>
    match = url.match(/edit[_;].*_id=([^&;]+)/);
    if (match && match[1]) return match[1];
    
    // Pattern 3: id=<id>
    match = url.match(/[?&;]id=([^&;]+)/);
    if (match && match[1]) return match[1];
    
    return '';
  }
  
  extractExpenseDetailsFromUrl(url: string): any {
    // Extract expense details from URL
    const categoryMatch = url.match(/category=([^&;]+)/);
    const amountMatch = url.match(/amount=([^&;]+)/);
    const dateMatch = url.match(/date=([^&;]+)/);
    const descriptionMatch = url.match(/description=([^&;]+)/);
    
    // Check if we have enough data to consider this valid
    if (categoryMatch && amountMatch) {
      return {
        category: categoryMatch ? decodeURIComponent(categoryMatch[1]) : '',
        amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
        date: dateMatch ? decodeURIComponent(dateMatch[1]) : '',
        description: descriptionMatch ? decodeURIComponent(descriptionMatch[1]) : ''
      };
    }
    
    return null;
  }
  
  populateFormFromExpenseData(expense: any): void {
    console.log('Populating form from expense data:', expense);
    
    try {
      // Format the date
      let formattedDate = '';
      if (expense.date) {
        try {
          formattedDate = new Date(expense.date).toISOString().split('T')[0];
        } catch (e) {
          console.error('Date formatting error:', e);
        }
      }
      
      // Find closest category
      const category = this.findClosestCategory(expense.category || '');
      
      // Update form
      this.expenseForm.patchValue({
        description: expense.description || '',
        amount: expense.amount || 0,
        date: formattedDate,
        category: category
      });
      
      console.log('Form populated:', this.expenseForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }
  
  findClosestCategory(category: string): string {
    if (!category) return '';
    
    // Find exact match
    if (this.categories.includes(category)) {
      return category;
    }
    
    // Handle URL-encoded categories
    const decodedCategory = decodeURIComponent(category);
    if (this.categories.includes(decodedCategory)) {
      return decodedCategory;
    }
    
    // Try to find partial match
    for (const cat of this.categories) {
      if (decodedCategory.includes(cat) || cat.includes(decodedCategory)) {
        return cat;
      }
    }
    
    return 'Other';
  }
  
  loadExpenseDetails(): void {
    if (!this.expenseId) {
      this.errorMessage = 'No valid expense ID provided';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading expense with ID:', this.expenseId);
    
    const loadSub = this.expenseService.getExpenseById(this.expenseId).subscribe({
      next: (expense) => {
        console.log('Loaded expense:', expense);
        
        if (!expense) {
          this.errorMessage = 'Expense not found';
          this.isLoading = false;
          return;
        }
        
        // Populate form with loaded data
        this.populateFormFromExpenseData(expense);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expense', error);
        this.errorMessage = 'Failed to load expense details. Please try again.';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(loadSub);
  }

  onSubmit(): void {
    console.log("Form submitted", this.expenseForm.value);
    console.log("Form validity:", this.expenseForm.valid);
    
    if (!this.expenseForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.expenseForm.controls).forEach(key => {
        const control = this.expenseForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    if (!this.isUpdating || !this.expenseId) {
      this.errorMessage = 'Cannot update: No valid expense ID available';
      return;
    }
    
    this.updateExpense();
  }
  
  updateExpense(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const updatedExpense = this.expenseForm.value;
    
    console.log("Updating expense with data:", updatedExpense);
    console.log("Using expense ID:", this.expenseId);
    
    const updateSub = this.expenseService.updateExpense(this.expenseId, updatedExpense).subscribe({
      next: () => {
        console.log("Update successful, navigating to expense list");
        this.isLoading = false;

        this.successMessage = 'Expense updated successfully!';
        setTimeout(() => {
        this.router.navigate(['/expense']).then(() => {
          console.log("Navigation complete");
        });
      },1500);
    },
      error: (error) => {
        console.error('Error updating expense', error);
        this.errorMessage = 'Failed to update expense. Please check your connection and try again.';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(updateSub);
  }
  
  cancel(): void {
    this.router.navigate(['/expense']);
  }
}































