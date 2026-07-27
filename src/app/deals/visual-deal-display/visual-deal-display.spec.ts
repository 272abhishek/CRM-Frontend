import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualDealDisplay } from './visual-deal-display';

describe('VisualDealDisplay', () => {
  let component: VisualDealDisplay;
  let fixture: ComponentFixture<VisualDealDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualDealDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualDealDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
