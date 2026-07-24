import { TestBed } from '@angular/core/testing';

import { PropertyVisit } from './property-visit';

describe('PropertyVisit', () => {
  let service: PropertyVisit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyVisit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
