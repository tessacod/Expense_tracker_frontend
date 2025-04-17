

import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../service/expense.service';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BudgetComponent implements OnInit {
  totalBudget: number = 0; // Initialize to 0 for new users
  spentAmount: number = 0;
  newBudgetAmount: number = 0; // Initialize with 0
  remainingPercentage: number = 0;
  progressWidth: string = '0%';
  isLoading: boolean = true;
  isNewUser: boolean = true;
  
  constructor(
    private expenseService: ExpenseService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadBudgetData();
  }

  // Handle input change event
  onBudgetInputChange(event: any): void {
    this.newBudgetAmount = Number(event.target.value);
  }
  
  loadBudgetData(): void {
    this.isLoading = true;
    
    // Load expenses for current month to calculate spent amount
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        // Get current month in YYYY-MM format
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        // Filter expenses for current month
        const currentMonthExpenses = expenses.filter(expense => 
          expense.date && expense.date.startsWith(currentMonth)
        );
        
        // Calculate spent amount
        this.spentAmount = currentMonthExpenses.reduce((total, expense) => 
          total + Number(expense.amount), 0);
        
        // Now get budget data
        this.expenseService.getBudget().subscribe({
          next: (budgetData) => {
            if (budgetData && budgetData.totalBudget > 0) {
              this.totalBudget = budgetData.totalBudget;
              this.newBudgetAmount = budgetData.totalBudget;
              this.isNewUser = false;
            } else {
              this.totalBudget = 0; // Default to 0 for new users
              this.newBudgetAmount = 0;
              this.isNewUser = true;
            }
            
            // Calculate metrics
            this.calculateBudgetMetrics();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading budget data:', error);
            this.totalBudget = 0;
            this.newBudgetAmount = 0;
            this.isNewUser = true;
            this.calculateBudgetMetrics();
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.spentAmount = 0;
        this.isLoading = false;
        
        // If there's shared data available
        if (this.sharedDataService && this.sharedDataService.expenseTotal > 0) {
          this.spentAmount = this.sharedDataService.expenseTotal;
        }
        
        // Still try to get budget data
        this.expenseService.getBudget().subscribe({
          next: (budgetData) => {
            if (budgetData && budgetData.totalBudget > 0) {
              this.totalBudget = budgetData.totalBudget;
              this.newBudgetAmount = budgetData.totalBudget;
              this.isNewUser = false;
            }
            this.calculateBudgetMetrics();
          },
          error: () => {
            this.totalBudget = 0;
            this.newBudgetAmount = 0;
            this.isNewUser = true;
            this.calculateBudgetMetrics();
          }
        });
      }
    });
  }
  
  calculateBudgetMetrics(): void {
    // Calculate remaining budget percentage
    if (this.totalBudget > 0) {
      this.remainingPercentage = Math.round(((this.totalBudget - this.spentAmount) / this.totalBudget) * 100);
      if (this.remainingPercentage < 0) {
        this.remainingPercentage = 0;
      }
      
      // Calculate progress bar width
      const percentSpent = (this.spentAmount / this.totalBudget) * 100;
      this.progressWidth = Math.min(percentSpent, 100) + '%';
    } else {
      this.remainingPercentage = 0;
      this.progressWidth = '0%';
    }
  }
  
  updateBudget(): void {
    if (this.newBudgetAmount === undefined || this.newBudgetAmount < 0) {
      alert('Please enter a valid budget amount');
      return;
    }
    
    const budgetData = { totalBudget: this.newBudgetAmount };
    
    // Save to backend
    this.expenseService.updateBudget(budgetData).subscribe({
      next: (response) => {
        // Update the UI
        this.totalBudget = this.newBudgetAmount;
        this.isNewUser = false;
        this.calculateBudgetMetrics();
        
        // Update shared service
        if (this.sharedDataService) {
          this.sharedDataService.budgetAmount = this.newBudgetAmount;
        }
        
        // Show success notification
        this.showNotification('Budget updated successfully!');
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating budget:', error);
        alert('Failed to update budget. Please try again.');
      }
    });
  }
  
  private showNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
}