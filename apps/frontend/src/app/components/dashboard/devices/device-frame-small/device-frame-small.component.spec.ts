import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFrameSmallComponent } from './device-frame-small.component';

describe('DeviceFrameSmallComponent', () => {
  let component: DeviceFrameSmallComponent;
  let fixture: ComponentFixture<DeviceFrameSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceFrameSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceFrameSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
