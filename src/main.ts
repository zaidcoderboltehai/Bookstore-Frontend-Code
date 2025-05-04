import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Bootstrap standalone AppComponent
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),       // For routing
    provideHttpClient(),         // For HTTP calls
    provideAnimations()          // For Angular Material animations
  ]
}).catch(err => console.error(err));