import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiLteDeviceComponent } from './wifi-lte-device.component';

describe('WifiLteDeviceComponent', () => {
  let component: WifiLteDeviceComponent;
  let fixture: ComponentFixture<WifiLteDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WifiLteDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WifiLteDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
