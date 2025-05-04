import { Component, Inject, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router, NavigationStart } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  activeTab: "login" | "register" = "login";
  showPassword = false;
  isSubmitting = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<LoginComponent, any>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { isModal: boolean }
  ) {
    // Redirect already logged-in users
    if (!this.data?.isModal && this.authService.isLoggedIn()) {
      this.closeModal();
      this.router.navigate(['/dashboard']);
    }

    // Prevent navigation when in modal mode
    if (this.data?.isModal) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.router.navigateByUrl(this.router.url);
        }
      });
    }

    // Initialize login form
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    // Initialize register form
    this.registerForm = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value
      ? null
      : { mismatch: true };
  }

  private closeModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  toggleTab(tab: "login" | "register"): void {
    this.activeTab = tab;
    this.errorMessage = "";
    this.loginForm.reset();
    this.registerForm.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.storeUserSession(response);
        if (!this.data?.isModal) {
          this.router.navigate(['/dashboard']);
        }
        this.closeModal();
      },
      error: (error) => {
        this.errorMessage = "Invalid email or password";
        this.isSubmitting = false;
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = "";
    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.authService.login(email, password).subscribe({
          next: (loginResponse) => {
            this.authService.storeUserSession(loginResponse);
            if (!this.data?.isModal) {
              this.router.navigate(['/dashboard']);
            }
            this.closeModal();
          },
          error: () => {
            this.errorMessage = "Auto-login failed. Please login manually.";
            this.isSubmitting = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = this.parseRegistrationError(error);
        this.isSubmitting = false;
      }
    });
  }

  private parseRegistrationError(error: any): string {
    if (error.status === 409) return "Email already registered";
    if (error.status === 400) {
      return error.error?.errors?.[0]?.message || "Invalid registration data";
    }
    return "Registration failed. Please try again.";
  }
}