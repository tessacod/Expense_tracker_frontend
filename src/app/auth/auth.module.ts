

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Auth Components
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './new-user/new-user.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: NewUserComponent },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  declarations: [
    LoginComponent,
    NewUserComponent,
    LogoutComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AuthModule { }


