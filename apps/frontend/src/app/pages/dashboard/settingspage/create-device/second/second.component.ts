import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';
import { DeviceType } from '../../../../../../types/types';
import { DeviceService } from '../../../../../services/device.service';

@Component({
  selector: 'app-second',
  standalone: false,
  templateUrl: './second.component.html',
  styleUrl: './second.component.css',
})
export class SecondComponent {
  public deviceName = '';
  public deviceDescription = '';
  public deviceImage: File | string | undefined;
  public latitude!: Number;
  public longitude!: Number;
  public sendsFirstArgumentAsTimestamp = false;

  public isMqttORTTNDevice = false;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async next() {
    if (this.deviceName.length <= 0 || this.deviceName.length > 15) {
      this.toast.error('Device name must be between 1 and 15 characters.');
      return;
    }

    if (
      this.deviceDescription.length <= 0 ||
      this.deviceDescription.length > 100
    ) {
      this.toast.error(
        'Device description must be between 1 and 100 characters.',
      );
      return;
    }

    if (!this.deviceImage) {
      this.toast.error('Please select a device image.');
      return;
    }

    if (!this.latitude || !this.longitude) {
      this.toast.error('Device must have a latitude and longitude.');
      return;
    }

    const existingSettings = CreateDeviceStorage.getDeviceStorage();
    if (existingSettings === undefined) {
      this.toast.error('Device settings not found.');
      return;
    }
    existingSettings.deviceName = this.deviceName;
    existingSettings.deviceDescription = this.deviceDescription;
    existingSettings.deviceImage = this.deviceImage;
    existingSettings.latitude = this.latitude;
    existingSettings.longitude = this.longitude;
    existingSettings.sendsFirstParamTimestamp =
      this.sendsFirstArgumentAsTimestamp;
    await existingSettings.saveToLocalStorage();

    //Depending on the device type, we will navigate to the next page

    switch (existingSettings.deviceType) {
      case DeviceType.MQTT:
        this.router.navigate([
          [document.location.pathname.slice(0, -2)] + '/2.1',
        ]);
        break;
      case DeviceType.TTN:
        this.router.navigate([
          [document.location.pathname.slice(0, -2)] + '/2.1',
        ]);
        break;

      case DeviceType.CAMERA:
        this.router.navigate([
          [document.location.pathname.slice(0, -2)] + '/3.3',
        ]);
        break;

      case DeviceType.GATEWAY:
        this.router.navigate([
          [document.location.pathname.slice(0, -2)] + '/3.4',
        ]);
        break;
    }
  }

  public onFileChange(evt: any) {
    this.deviceImage = evt.target.files[0];
  }

  ngOnInit() {
    const existingSettings = CreateDeviceStorage.getDeviceStorage();
    if (existingSettings === undefined) {
      this.toast.error('Device settings not found.');
      return;
    }
    this.deviceName = existingSettings.deviceName;
    this.deviceDescription = existingSettings.deviceDescription;
    this.deviceImage = existingSettings.deviceImage;
    this.latitude = existingSettings.latitude;
    this.longitude = existingSettings.longitude;
    this.sendsFirstArgumentAsTimestamp =
      existingSettings.sendsFirstParamTimestamp;

    if (
      existingSettings.deviceType === DeviceType.MQTT ||
      existingSettings.deviceType === DeviceType.TTN
    ) {
      this.isMqttORTTNDevice = true;
    }
  }
}
