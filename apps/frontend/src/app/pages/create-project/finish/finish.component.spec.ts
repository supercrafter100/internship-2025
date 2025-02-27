import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectFinishStep } from './finish.component';

describe('CreateProjectFinishStep', () => {
  let component: CreateProjectFinishStep;
  let fixture: ComponentFixture<CreateProjectFinishStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectFinishStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectFinishStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
