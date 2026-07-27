import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualPropertyVisitDisplay } from './visual-property-visit-display';

describe('VisualPropertyVisitDisplay', () => {
  let component: VisualPropertyVisitDisplay;
  let fixture: ComponentFixture<VisualPropertyVisitDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualPropertyVisitDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualPropertyVisitDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
