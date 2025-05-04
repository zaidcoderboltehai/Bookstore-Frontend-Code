import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoginComponent // Standalone component import
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: ''
    });
  });

  it('should make email field required', () => {
    const email = component.loginForm.controls.email;
    email.setValue('');
    expect(email.hasError('required')).toBeTrue();
  });

  it('should validate email format', () => {
    const email = component.loginForm.controls.email;
    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTrue();
  });

  it('should make password field required', () => {
    const password = component.loginForm.controls.password;
    password.setValue('');
    expect(password.hasError('required')).toBeTrue();
  });

  it('should enforce minimum password length (6 characters)', () => {
    const password = component.loginForm.controls.password;
    password.setValue('123');
    expect(password.hasError('minlength')).toBeTrue();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should not call authService.login when form is invalid', () => {
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    
    component.onLoginSubmit();
    
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with correct credentials', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    component.loginForm.controls.email.setValue(testEmail);
    component.loginForm.controls.password.setValue(testPassword);
    
    component.onLoginSubmit();
    
    expect(authService.login).toHaveBeenCalledWith(testEmail, testPassword);
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should show loading state during submission', () => {
    component.isSubmitting = true;
    fixture.detectChanges();
    
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.textContent).toContain('Please Wait...');
  });
});