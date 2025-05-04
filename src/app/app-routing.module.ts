import { NgModule } from "@angular/core";
import { RouterModule, type Routes } from "@angular/router";

// Export routes array for use in main.ts
export const routes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "login",
        loadComponent: () => 
          import("./auth/login/login.component").then((m) => m.LoginComponent),
        title: "Login - Bookstore",
      },
      {
        path: "signup",
        loadComponent: () => 
          import("./auth/signup/signup.component").then((m) => m.SignupComponent),
        title: "Sign Up - Bookstore",
      },
      { 
        path: "", 
        redirectTo: "login", 
        pathMatch: "full" 
      },
    ],
  },
  {
    path: "dashboard",
    loadComponent: () => 
      import("./dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },
  {
    path: "book/:id",
    loadComponent: () => 
      import("./book-detail/book-detail.component").then((m) => m.BookDetailComponent),
    title: "Book Details - Bookstore",
  },
  { 
    path: "", 
    redirectTo: "auth/login", 
    pathMatch: "full" 
  },
  { 
    path: "**", 
    redirectTo: "auth/login" 
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      // enableTracing: true // Uncomment for debugging
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}