import { TestBed } from '@angular/core/testing';

import { BookDetailService } from './book-detail.service';

describe('BookDetailService', () => {
  let service: BookDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
