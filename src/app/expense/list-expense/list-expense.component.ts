

//====================================
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../service/expense.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../shared-data.service';

interface MonthOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.css'],
})
export class ListExpenseComponent implements OnInit {
  componentId = Math.random().toString(36).substring(2);
  
  expenses: any[] = [];
  filteredExpenses: any[] = [];
  allExpenses: any[] = [];
  selectedMonth: string = '';
  availableMonths: MonthOption[] = []; // Changed from string[] to MonthOption[]
// View state management
showForm: boolean = false;
formMode: 'add' | 'edit' = 'add';
currentExpense: any = {};
  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
    this.loadExpenses();
    //add on 
  }

 
 loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      this.allExpenses = data;
      this.selectedMonth = this.getCurrentMonthYear();
      this.generateAvailableMonths();
      this.filterExpensesByMonth(this.selectedMonth);
    });
  }
  filterExpensesByMonth(monthYear: string) {
    this.selectedMonth = monthYear;
    
    if (!monthYear) {
      this.filteredExpenses = [...this.allExpenses];
    } else {
      this.filteredExpenses = this.allExpenses.filter(expense => {
        return expense.date && expense.date.startsWith(monthYear);
      });
    }
    
    this.sharedDataService.expenseList = this.filteredExpenses;
    this.sharedDataService.expenseTotal = this.calculateTotal();
  }
  calculateTotal(): number {
    return this.filteredExpenses.reduce((total, expense) => 
      total + Number(expense.amount), 0);
  }
  showAddForm() {
    this.formMode = 'add';
    this.currentExpense = {
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    };
    this.showForm = true;
  }
  showEditForm(expense: any) {
    this.formMode = 'edit';
    this.currentExpense = { ...expense };
    if (this.currentExpense.date) {
      this.currentExpense.date = this.currentExpense.date.split('T')[0];
    }
    this.showForm = true;
  }
  
  cancelForm() {
    this.showForm = false;
    this.currentExpense = {};
  }
  

  getCurrentMonthYear(): string {
    const now = new Date();
    // Format as YYYY-MM
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  generateAvailableMonths() {
    // Create a Set to hold unique month-year combinations
    const monthsSet = new Set<string>();
    
    this.allExpenses.forEach(expense => {
      if (expense.date) {
        // Extract YYYY-MM from the date string
        const dateParts = expense.date.split('T')[0].substring(0, 7);
        monthsSet.add(dateParts);
      }
    });
    
    // Convert to array of objects with value and label properties
    this.availableMonths = Array.from(monthsSet)
      .sort()
      .reverse()
      .map(monthYear => {
        const [year, month] = monthYear.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(month) - 1];
        return {
          value: monthYear,
          label: `${monthName} ${year}`
        };
      });
    
    // If current month not in list, add it
    const currentMonth = this.getCurrentMonthYear();
    if (!this.availableMonths.some(option => option.value === currentMonth)) {
      const [year, month] = currentMonth.split('-');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(month) - 1];
      
      this.availableMonths.unshift({
        value: currentMonth,
        label: `${monthName} ${year}`
      });
    }
  }

  
  navigateToAdd() {
    this.router.navigate(['/expense/add']);
  }






 

 
 // Update the saveExpense method to handle the UI state better
 saveExpense() {
  if (this.formMode === 'add') {
    this.expenseService.addExpense(this.currentExpense).subscribe({
      next: () => {
        this.showForm = false;
        this.currentExpense = {};
        this.loadExpenses();
      },
      error: (error) => {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
      }
    });
  } else {
    this.expenseService.updateExpense(this.currentExpense._id, this.currentExpense).subscribe({
      next: () => {
        this.showForm = false;
        this.currentExpense = {};
        this.loadExpenses();
      },
      error: (error) => {
        console.error('Error updating expense:', error);
        alert('Failed to update expense. Please try again.');
      }
    });
  }
}


  // Add this function to your list-expense.component.ts
  deleteExpense(expense: any): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(expense._id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          alert('Failed to delete expense. Please try again.');
        }
      });
    }
  }


  

 
  // In your list component
  editExpense(expense: any): void {
    // Make sure the expense ID is correctly passed as a route parameter
    this.router.navigate(['/expense/edit', expense._id], {
      // Optionally, you can still pass other data as query params if needed
      queryParams: {
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description
      }
    });
  }
}

//====================================
