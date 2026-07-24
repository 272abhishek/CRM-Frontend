import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVisitDetail } from './property-visit-detail';

describe('PropertyVisitDetail', () => {
  let component: PropertyVisitDetail;
  let fixture: ComponentFixture<PropertyVisitDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyVisitDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyVisitDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
