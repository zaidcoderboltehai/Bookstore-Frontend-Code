import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ✅ Token storage methods
  storeUserSession(response: any): void {
    if (response?.accessToken) {
      localStorage.setItem('bookstore_token', response.accessToken);
    }
    if (response?.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    if (response?.userId) {
      localStorage.setItem('user_id', response.userId.toString());
    }
    this.isLoggedInSubject.next(true);
  }

  // ✅ User registration
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Users/register`, {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: 'User'
    }).pipe(
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  // ✅ User login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/Users/login`,
      { 
        email: email.trim().toLowerCase(),
        password 
      }
    ).pipe(
      tap((response) => {
        this.storeUserSession(response);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  // ✅ Logout functionality
  logout(): void {
    localStorage.removeItem('bookstore_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
  }

  // ✅ Auth status check
  isLoggedIn(): boolean {
    return !!localStorage.getItem('bookstore_token');
  }

  // ✅ User data methods
  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId) : null;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('bookstore_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}