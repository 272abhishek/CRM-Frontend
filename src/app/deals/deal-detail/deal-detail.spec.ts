import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDetail } from './deal-detail';

describe('DealDetail', () => {
  let component: DealDetail;
  let fixture: ComponentFixture<DealDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(DealDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
