import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealEdit } from './deal-edit';

describe('DealEdit', () => {
  let component: DealEdit;
  let fixture: ComponentFixture<DealEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(DealEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
