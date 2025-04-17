


//1//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { BudgetComponent } from './budget/budget.component';
import { ReportComponent } from './report/report.component';
import { ListExpenseComponent } from './expense/list-expense/list-expense.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { EditExpenseComponent } from './expense/edit-expense/edit-expense.component';
import { DeleteExpenseComponent } from './expense/delete-expense/delete-expense.component';
import { ExpenseComponent } from './expense/expense.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { NewUserComponent } from './auth/new-user/new-user.component';

export const routes: Routes = [
  // Lazy load Auth Module (Optional)
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  // },

  // Public Auth Routes
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: NewUserComponent },

  // Protected Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'budget', component: BudgetComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },

  // Expense Routes (Nested with AuthGuard)
  { 
    path: 'expense', 
    component: ExpenseComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListExpenseComponent },
      { path: 'add', component: AddExpenseComponent },
      { path: 'edit/:id', component: EditExpenseComponent },
      { path: 'delete', component: DeleteExpenseComponent }
    ]
  },

  // Default Routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

