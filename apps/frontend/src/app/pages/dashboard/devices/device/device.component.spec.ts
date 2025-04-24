import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDeviceComponent } from './device.component';

describe('DashboardDeviceComponent', () => {
  let component: DashboardDeviceComponent;
  let fixture: ComponentFixture<DashboardDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardDeviceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
