// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Add this line

//import { ExpenseChartComponent } from './expense-chart/expense-chart.component';
//import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseModule } from './expense/expense.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { BudgetComponent } from './budget/budget.component';
import { LoginComponent } from './auth/login/login.component';
import { NewUserComponent } from './auth/new-user/new-user.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LogoutComponent } from './auth/logout/logout.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
   AppComponent,
  LoginComponent,
    BudgetComponent,
    NewUserComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LogoutComponent
    
  ],
  imports: [
    HttpClientModule, BrowserModule,FormsModule,
    ReactiveFormsModule,//AuthModule,
    CommonModule, 
  ExpenseModule,
  //AppComponent,
   AppRoutingModule,
  
    
 
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }










