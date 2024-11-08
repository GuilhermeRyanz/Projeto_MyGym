import { TestBed } from '@angular/core/testing';

import { HttpMethodsService } from './http-methods.service';

describe('HttpMethodsService', () => {
  let service: HttpMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
