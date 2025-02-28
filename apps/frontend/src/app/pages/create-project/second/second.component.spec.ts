import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectSecondStep } from './second.component';

describe('CreateProjectSecondStep', () => {
  let component: CreateProjectSecondStep;
  let fixture: ComponentFixture<CreateProjectSecondStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectSecondStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectSecondStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
