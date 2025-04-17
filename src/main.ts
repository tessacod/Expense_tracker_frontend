
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ExpenseModule } from './app/expense/expense.module';
import { ListExpenseComponent } from './app/expense/list-expense/list-expense.component';
import { AddExpenseComponent } from './app/expense/add-expense/add-expense.component';
import { EditExpenseComponent } from './app/expense/edit-expense/edit-expense.component';
import { DeleteExpenseComponent } from './app/expense/delete-expense/delete-expense.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { ProfileComponent } from './app/profile/profile.component';
import { BudgetComponent } from './app/budget/budget.component';
import { ReportComponent } from './app/report/report.component';
import { LoginComponent } from './app/auth/login/login.component';
import { NewUserComponent } from './app/auth/new-user/new-user.component';
import { LogoutComponent } from './app/auth/logout/logout.component';
import { AuthGuard } from './app/auth/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      // Your routes here
      { path: 'login', component: LoginComponent },
      { path: 'register', component: NewUserComponent }, // Added register route
      { path: 'logout', component: LogoutComponent },

      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent }, // This might be missing
      { path: 'budget', component: BudgetComponent },
      { path: 'report', component: ReportComponent },


      { path: 'expenses', component: ListExpenseComponent },
            { path: 'expense/add', component: AddExpenseComponent },
            { path: 'expense/edit', component: EditExpenseComponent },
            { path: 'expense/delete', component: DeleteExpenseComponent },  
      {
        path: 'expense',
        loadChildren: () => import('./app/expense/expense-routing.module')
          .then(m => m.ExpenseRoutingModule),
          canActivate: [AuthGuard]
      
      },
      { path: '', redirectTo: '/expenses', pathMatch: 'full' },

    ]),
    provideHttpClient(),
    importProvidersFrom(ExpenseModule)
  ]
}).catch(err => console.error(err));