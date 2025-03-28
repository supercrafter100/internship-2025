import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterstepComponent } from './parameterstep.component';

describe('ParameterstepComponent', () => {
  let component: ParameterstepComponent;
  let fixture: ComponentFixture<ParameterstepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterstepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
