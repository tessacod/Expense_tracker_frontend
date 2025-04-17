import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { ListExpenseComponent } from './list-expense/list-expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { DeleteExpenseComponent } from './delete-expense/delete-expense.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent,
    children: [
      { path: '', component: ListExpenseComponent },
      { path: 'list', component: ListExpenseComponent }, // Add this line
      { path: 'add', component: AddExpenseComponent },
      { path: 'edit/:id', component: EditExpenseComponent },
      { path: 'delete/:id', component: DeleteExpenseComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }


