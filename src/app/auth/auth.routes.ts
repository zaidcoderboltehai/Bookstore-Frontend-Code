// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const AUTH_ROUTES: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Login - Bookstore',
    data: { animation: 'loginPage' } // Optional: Add page transitions
  },
  { 
    path: 'signup', 
    component: SignupComponent,
    title: 'Sign Up - Bookstore',
    data: { animation: 'signupPage' } // Optional: Add page transitions
  },
  { 
    path: '**', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];