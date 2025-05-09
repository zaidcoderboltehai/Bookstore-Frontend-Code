import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
  declarations: [], // Keep empty (for standalone components)
  imports: [
    // For Angular common directives (ngIf, ngFor)
    CommonModule,
    
    // For RouterLink and router-outlet
    RouterModule,
    
    // Routes for Dashboard
    DashboardRoutingModule,
    
    // Import standalone component
    DashboardComponent
  ]
})
export class DashboardModule { }