import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  get f() {
    return this.forgotPasswordForm.controls;
  }
  
  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const email = this.forgotPasswordForm.value.email;
    
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Password reset link has been sent to your email';
        setTimeout(() => this.close(), 3000); // Close after 3 seconds
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
      }
    });
  }
  
  close() {
    this.dialogRef.close();
  }
}