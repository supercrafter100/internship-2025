import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectThirdStep } from './third.component';

describe('CreateProjectThirdStep', () => {
  let component: CreateProjectThirdStep;
  let fixture: ComponentFixture<CreateProjectThirdStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectThirdStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectThirdStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
