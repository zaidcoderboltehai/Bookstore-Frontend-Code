import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['register', 'isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SignupComponent // Import as component is standalone
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.isLoggedIn.and.returnValue(false);

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.signupForm.get('fullName')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('mobileNumber')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate fullName field', () => {
    const fullNameControl = component.signupForm.get('fullName');
    
    fullNameControl?.setValue('');
    expect(fullNameControl?.valid).toBeFalsy();
    expect(fullNameControl?.hasError('required')).toBeTruthy();
    
    fullNameControl?.setValue('Jo');
    expect(fullNameControl?.valid).toBeFalsy();
    expect(fullNameControl?.hasError('minlength')).toBeTruthy();
    
    fullNameControl?.setValue('John Doe');
    expect(fullNameControl?.valid).toBeTruthy();
  });

  it('should validate email field', () => {
    const emailControl = component.signupForm.get('email');
    
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const passwordControl = component.signupForm.get('password');
    
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
    
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    passwordControl?.setValue('password');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('pattern')).toBeTruthy();
    
    passwordControl?.setValue('Password123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate mobileNumber field', () => {
    const mobileNumberControl = component.signupForm.get('mobileNumber');
    
    mobileNumberControl?.setValue('');
    expect(mobileNumberControl?.valid).toBeFalsy();
    expect(mobileNumberControl?.hasError('required')).toBeTruthy();
    
    mobileNumberControl?.setValue('123');
    expect(mobileNumberControl?.valid).toBeFalsy();
    expect(mobileNumberControl?.hasError('pattern')).toBeTruthy();
    
    mobileNumberControl?.setValue('1234567890');
    expect(mobileNumberControl?.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalsy();
  });

  it('should not call register service if form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call register service if form is valid', () => {
    component.signupForm.setValue({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
      mobileNumber: '1234567890'
    });
    
    authServiceSpy.register.and.returnValue({
      subscribe: () => {}
    } as any);
    
    component.onSubmit();
    
    expect(authServiceSpy.register).toHaveBeenCalled();
  });

  it('should split fullName into firstName and lastName', () => {
    component.signupForm.setValue({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
      mobileNumber: '1234567890'
    });
    
    authServiceSpy.register.and.returnValue({
      subscribe: () => {}
    } as any);
    
    component.onSubmit();
    
    const userData = authServiceSpy.register.calls.mostRecent().args[0];
    expect(userData.firstName).toBe('John');
    expect(userData.lastName).toBe('Doe');
  });
});