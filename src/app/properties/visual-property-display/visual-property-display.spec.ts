import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualPropertyDisplay } from './visual-property-display';

describe('VisualPropertyDisplay', () => {
  let component: VisualPropertyDisplay;
  let fixture: ComponentFixture<VisualPropertyDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualPropertyDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualPropertyDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
