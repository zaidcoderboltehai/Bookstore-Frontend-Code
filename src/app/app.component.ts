import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // RouterOutlet for navigation
  template: `
    <div class="app-container">
      <router-outlet></router-outlet> <!-- Main content outlet -->
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh; /* Full viewport height */
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: #ffffff; /* Optional: White background */
    }
  `]
})
export class AppComponent {
  // Title property (optional - can be removed if not used)
  title = 'bookstore-frontend';
}