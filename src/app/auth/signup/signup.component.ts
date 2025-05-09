import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule, NgIf } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf
  ]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = "";
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Form validation with password match
    this.signupForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]]
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  // Password match validation
  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Return if form is invalid
    if (this.signupForm.invalid || this.signupForm.errors?.['mismatch']) return;

    this.isLoading = true;
    this.errorMessage = "";

    const userData = {
      firstName: this.signupForm.value.firstName.trim(),
      lastName: this.signupForm.value.lastName.trim(),
      email: this.signupForm.value.email.trim().toLowerCase(),
      password: this.signupForm.value.password
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}