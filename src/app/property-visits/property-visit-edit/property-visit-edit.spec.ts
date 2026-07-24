import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVisitEdit } from './property-visit-edit';

describe('PropertyVisitEdit', () => {
  let component: PropertyVisitEdit;
  let fixture: ComponentFixture<PropertyVisitEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyVisitEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyVisitEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
