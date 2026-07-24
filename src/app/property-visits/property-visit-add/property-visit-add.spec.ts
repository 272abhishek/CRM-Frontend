import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVisitAdd } from './property-visit-add';

describe('PropertyVisitAdd', () => {
  let component: PropertyVisitAdd;
  let fixture: ComponentFixture<PropertyVisitAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyVisitAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyVisitAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
