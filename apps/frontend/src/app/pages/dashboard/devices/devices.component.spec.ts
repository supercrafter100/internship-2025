import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDevicesComponent } from './devices.component';

describe('DevicesComponent', () => {
  let component: DashboardDevicesComponent;
  let fixture: ComponentFixture<DashboardDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardDevicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
