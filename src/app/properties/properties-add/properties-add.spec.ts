import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesAdd } from './properties-add';

describe('PropertiesAdd', () => {
  let component: PropertiesAdd;
  let fixture: ComponentFixture<PropertiesAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
