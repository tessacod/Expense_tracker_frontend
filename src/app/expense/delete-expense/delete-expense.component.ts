
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../service/expense.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-expense',
  templateUrl: './delete-expense.component.html', 
  styleUrls: ['./delete-expense.component.css']
})
export class DeleteExpenseComponent implements OnInit {
  expenseId: string = '';
  
  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit() {
    // Get the expense ID from route params
    this.route.params.subscribe(params => {
      this.expenseId = params['id'];
      this.confirmDelete();
    });
  }
  
  confirmDelete() {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.deleteExpense();
    } else {
      this.router.navigate(['/expenses']);
    }
  }
  
  deleteExpense() {
    this.expenseService.deleteExpense(this.expenseId).subscribe({
      next: () => {
        console.log('Expense deleted successfully');
        this.router.navigate(['/expenses']);
      },
      error: (err) => {
        console.error('Error deleting expense', err);
      }
    });
  }
}
