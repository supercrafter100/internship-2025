import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectSecondInputStep } from './second-input.component';

describe('CreateProjectSecondInputStep', () => {
  let component: CreateProjectSecondInputStep;
  let fixture: ComponentFixture<CreateProjectSecondInputStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectSecondInputStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectSecondInputStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
