import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualClientDisplay } from './visual-client-display';

describe('VisualClientDisplay', () => {
  let component: VisualClientDisplay;
  let fixture: ComponentFixture<VisualClientDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualClientDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualClientDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
