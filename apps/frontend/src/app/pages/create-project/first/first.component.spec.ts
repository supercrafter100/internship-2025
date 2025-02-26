import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectFirstStep } from './first.component';

describe('CreateProjectFirstStep', () => {
  let component: CreateProjectFirstStep;
  let fixture: ComponentFixture<CreateProjectFirstStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectFirstStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectFirstStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
