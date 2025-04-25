import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectThirdInputStep } from './third-input.component';

describe('CreateProjectThirdInputStep', () => {
  let component: CreateProjectThirdInputStep;
  let fixture: ComponentFixture<CreateProjectThirdInputStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectThirdInputStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectThirdInputStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
