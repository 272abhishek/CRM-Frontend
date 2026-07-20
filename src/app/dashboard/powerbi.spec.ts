import { TestBed } from '@angular/core/testing';

import { Powerbi } from './powerbi';

describe('Powerbi', () => {
  let service: Powerbi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Powerbi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
