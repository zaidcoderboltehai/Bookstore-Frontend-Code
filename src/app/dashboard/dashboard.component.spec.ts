import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        DashboardComponent
      ],
      providers: [
        { 
          provide: AuthService, 
          useValue: jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']) 
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle sort dropdown", () => {
    expect(component.showSortDropdown).toBeFalse();
    component.toggleSortDropdown();
    expect(component.showSortDropdown).toBeTrue();
    component.toggleSortDropdown();
    expect(component.showSortDropdown).toBeFalse();
  });

  it("should select sort option", () => {
    const testSort = "price: low to high";
    component.selectSort(testSort);
    expect(component.selectedSort).toBe(testSort);
    expect(component.showSortDropdown).toBeFalse();
  });

  it("should navigate to book detail", () => {
    const bookId = 1;
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToBookDetail(bookId);
    expect(navigateSpy).toHaveBeenCalledWith(['/book', bookId]);
  });

  it("should handle profile dropdown visibility", () => {
    const event = new Event('click');
    spyOn(event, 'preventDefault');
    
    expect(component.showProfileDropdown).toBeFalse();
    component.toggleProfileDropdown(event);
    expect(component.showProfileDropdown).toBeTrue();
    component.toggleProfileDropdown(event);
    expect(component.showProfileDropdown).toBeFalse();
  });

  it("should change page correctly", () => {
    component.currentPage = 2;
    component.changePage(3);
    expect(component.currentPage).toBe(3);
    
    component.changePage(0); // Should clamp to 1
    expect(component.currentPage).toBe(1);
  });
});