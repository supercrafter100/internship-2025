import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardApiComponent } from './api.component';

describe('ApiComponent', () => {
  let component: DashboardApiComponent;
  let fixture: ComponentFixture<DashboardApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
