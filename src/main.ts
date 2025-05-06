import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient, withInterceptors, HttpRequest } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Create an interceptor function with proper types
function authInterceptor(req: HttpRequest<unknown>, next: any) {
  const token = localStorage.getItem('bookstore_token');
  console.log('AuthInterceptor: Token found?', !!token);
  
  if (token) {
    console.log('AuthInterceptor: Adding token to request', req.url);
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  console.log('AuthInterceptor: No token found, sending request without token');
  return next(req);
}

// Bootstrap standalone AppComponent
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),       // For routing
    provideHttpClient(withInterceptors([authInterceptor])),  // Register interceptor
    provideAnimations()          // For Angular Material animations
  ]
}).catch(err => console.error(err));