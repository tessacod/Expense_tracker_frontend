import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  expenseTotal: number = 0;
  expenseList: any[] = [];
  budgetAmount: number = 0;
  constructor() { }
  
  updateExpenseTotal(total: number): void {
    this.expenseTotal = total;
  }
  
  updateBudgetAmount(amount: number): void {
    this.budgetAmount = amount;
  }
}

