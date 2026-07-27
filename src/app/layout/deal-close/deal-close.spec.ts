import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealClose } from './deal-close';

describe('DealClose', () => {
  let component: DealClose;
  let fixture: ComponentFixture<DealClose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealClose],
    }).compileComponents();

    fixture = TestBed.createComponent(DealClose);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
