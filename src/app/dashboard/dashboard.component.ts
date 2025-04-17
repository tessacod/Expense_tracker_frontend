
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ExpenseService } from '../service/expense.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Add ElementRef for the chart canvas
  @ViewChild('pieChart') pieChartCanvas!: ElementRef;
  pieChart: Chart | null = null; // Initialize with null

  totalExpenses = 0;
  categoryCount = 0;
  recentExpenses: any[] = [];
  monthlyBudget = 0; // Initialize budget to 0 for new users
  budgetSet = false; // Flag to check if budget has been set
  isLoading = true;
  hasExpenses = false;
  error = '';
  currentMonth = '';
  percentChange = 0;
  Math = Math;
  firstTimeUser = true; // Add flag to track if user is new
  
  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService // Add AuthService
  ) {}
  
  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonthYear();
    // Check if user has any data first
    this.checkUserData();
    
    // Register Chart.js components
    Chart.register(PieController, ArcElement, Tooltip, Legend);
  }
  
  ngAfterViewInit(): void {
    // We'll create the chart after data is loaded
  }
  
  getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  
  getMonthName(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  // Check if the user has any data to determine if they're new or existing
  checkUserData(): void {
    this.isLoading = true;
    
    // First check for any expenses
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        // If user has expenses, they're not a first-time user
        if (expenses && expenses.length > 0) {
          this.firstTimeUser = false;
          this.hasExpenses = true;
          this.loadDashboardData(expenses);
        } else {
          // No expenses, check if they've set a budget
          this.checkBudget();
        }
      },
      error: (error) => {
        console.error('Error checking user data', error);
        this.error = 'Failed to load your data. Please try logging in again.';
        this.isLoading = false;
      }
    });
  }
  
  checkBudget(): void {
    // Check if the user has set a budget
    this.expenseService.getBudget().subscribe({
      next: (budgetData) => {
        if (budgetData && budgetData.totalBudget) {
          this.monthlyBudget = budgetData.totalBudget;
          this.budgetSet = true;
          this.firstTimeUser = false; // If they set a budget, they're not completely new
        } else {
          this.monthlyBudget = 0;
          this.budgetSet = false;
          this.firstTimeUser = true; // Confirm they're a new user
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading budget data', error);
        this.monthlyBudget = 0;
        this.budgetSet = false;
        this.isLoading = false;
      }
    });
  }
  
  loadDashboardData(existingExpenses?: any[]): void {
    this.isLoading = true;
    this.error = '';
    
    if (existingExpenses) {
      // If expenses were already fetched, use those
      const expenses = existingExpenses;
      this.processExpenseData(expenses);
    } else {
      // Otherwise, fetch them
      this.expenseService.getExpenses().subscribe({
        next: (expenses) => {
          this.processExpenseData(expenses);
        },
        error: (error) => {
          console.error('Error loading dashboard data', error);
          this.error = 'Failed to load expenses. Please try logging in again.';
          this.isLoading = false;
        }
      });
    }
  }
  
  processExpenseData(expenses: any[]): void {
    const currentMonthExpenses = expenses.filter(expense => 
      expense.date && expense.date.startsWith(this.currentMonth)
    );
    
    this.hasExpenses = currentMonthExpenses.length > 0;
    
    this.totalExpenses = currentMonthExpenses.reduce((total, expense) => 
      total + Number(expense.amount), 0);
    
    const uniqueCategories = new Set(currentMonthExpenses.map(expense => expense.category));
    this.categoryCount = uniqueCategories.size;
    
    this.calculatePercentChange(expenses);
    
    this.recentExpenses = currentMonthExpenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 12);
    
    // Check budget data if we have expenses
    if (this.hasExpenses) {
      this.checkBudget();
    }
    
    this.isLoading = false;
    
    // Create chart after data is loaded and the view has been initialized
    setTimeout(() => {
      if (this.hasExpenses && this.pieChartCanvas) {
        this.createPieChart(currentMonthExpenses);
      }
    }, 0);
  }
  
  calculatePercentChange(allExpenses: any[]): void {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const prevMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const prevMonthExpenses = allExpenses.filter(expense => 
      expense.date && expense.date.startsWith(prevMonth)
    );
    
    const prevMonthTotal = prevMonthExpenses.reduce((total, expense) => 
      total + Number(expense.amount), 0);
    
    if (prevMonthTotal > 0) {
      this.percentChange = ((this.totalExpenses - prevMonthTotal) / prevMonthTotal) * 100;
    } else {
      this.percentChange = 0;
    }
  }

  createPieChart(expenses: any[]): void {
    // Destroy existing chart if it exists
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Group expenses by category
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      if (!expense.category) return;
      
      const category = expense.category;
      const amount = Number(expense.amount);
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });

    // Prepare chart data
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC249', '#EA5545', '#27AEEF', '#87BC45'
    ];

    categoryMap.forEach((amount, category) => {
      labels.push(category);
      data.push(Number(amount.toFixed(2)));
    });

    // Create chart
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }
}
