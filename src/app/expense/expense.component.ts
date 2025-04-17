




// expense.component.ts
import { Component, OnInit} from '@angular/core';
import { ExpenseService } from '../service/expense.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  expenses: any[] = [];
  expenseForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private expenseService: ExpenseService,
   //private router: Router
   private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadExpenses();
    this.initForm();}
  
    initForm(): void {
      this.expenseForm = this.formBuilder.group({
        description: ['', [Validators.required]],
        amount: ['', [Validators.required, Validators.min(0.0)]],
        date: [new Date().toISOString().split('T')[0], [Validators.required]]
      });
    }
  loadExpenses(): void {1
    this.expenseService.getExpenses()
      .subscribe(
        (data) => {
          this.expenses = data;
        },
        (error) => {
          console.error('Error fetching expenses:', error);
        }
      );
  }
  addExpense(): void {
    if (this.expenseForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    const expenseData = {
      description: this.expenseForm.get('description')?.value,
      amount: parseFloat(this.expenseForm.get('amount')?.value),
      date: this.expenseForm.get('date')?.value
    };
    
    this.expenseService.addExpense(expenseData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Expense added successfully!';
        this.expenseForm.reset();
        this.initForm(); // Reset with default date
        this.loadExpenses(); // Reload the expense list
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Failed to add expense. Please try again.';
      }
    });
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).subscribe({
      next: (response) => {
        this.expenses = this.expenses.filter(expense => expense._id !== id);
      },
      error: (error) => {
        console.error('Error deleting expense', error);
      }
    });
  }
  editExpense(expense: any) {
    // Navigate to edit page or open a modal
//this.router.navigate(['/expense/edit', expense._id]);
}



}
