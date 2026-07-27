import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualTaskDisplay } from './visual-task-display';

describe('VisualTaskDisplay', () => {
  let component: VisualTaskDisplay;
  let fixture: ComponentFixture<VisualTaskDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualTaskDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualTaskDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
