import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectStepsComponent } from './steps.component';

describe('CreateProjectStepsComponent', () => {
  let component: CreateProjectStepsComponent;
  let fixture: ComponentFixture<CreateProjectStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectStepsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
