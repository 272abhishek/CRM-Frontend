import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVisitList } from './property-visit-list';

describe('PropertyVisitList', () => {
  let component: PropertyVisitList;
  let fixture: ComponentFixture<PropertyVisitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyVisitList],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyVisitList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
