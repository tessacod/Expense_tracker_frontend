

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { ExpenseComponent } from './expense.component';
//import { HttpClientModule } from '@angular/common/http';
 import { ExpenseRoutingModule } from './expense-routing.module';
 import { ExpenseComponent } from './expense.component';
 import { ListExpenseComponent } from './list-expense/list-expense.component';
// import { AddExpenseComponent } from './add-expense/add-expense.component';
// import { EditExpenseComponent } from './edit-expense/edit-expense.component';
// import { DeleteExpenseComponent } from './delete-expense/delete-expense.component';
//import { ListExpenseComponent } from './list-expense/list-expense.component';
@NgModule({
  declarations: [
    ExpenseComponent,
    ListExpenseComponent,
  
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
//    HttpClientModule,
    ExpenseRoutingModule,
      
  ], // schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
     CurrencyPipe // Explicitly provide the CurrencyPipe
   ],
  exports: [
    ExpenseComponent, ListExpenseComponent  ]
})
export class ExpenseModule { }

