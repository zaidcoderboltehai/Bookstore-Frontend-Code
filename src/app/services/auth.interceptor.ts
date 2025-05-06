import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Get token from localStorage
    const token = localStorage.getItem('bookstore_token');
    console.log('AuthInterceptor: Token found?', !!token);

    // 2. Clone request and add authorization header
    if (token) {
      console.log('AuthInterceptor: Adding token to request', req.url);
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    console.log('AuthInterceptor: No token found, sending request without token');
    // 3. Pass through original request if no token
    return next.handle(req);
  }
}