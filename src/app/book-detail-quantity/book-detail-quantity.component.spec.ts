import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailQuantityComponent } from './book-detail-quantity.component';

describe('BookDetailQuantityComponent', () => {
  let component: BookDetailQuantityComponent;
  let fixture: ComponentFixture<BookDetailQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookDetailQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});