import { Component } from '@angular/core';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { getDashboardId } from '../../../../../../util/utils';

@Component({
  selector: 'app-first',
  standalone: false,
  templateUrl: './first.component.html',
  styleUrl: './first.component.css',
})
export class FirstComponent {
  public projectName = '';
  public projectDescription = '';
  public projectImage: File | string | undefined;
  public projectPublic = false;

  public allDeviceTypes = Object.values(DeviceType);
  public deviceType?: DeviceType;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async submit() {
    if (!this.deviceType) {
      this.toast.error(
        'A device type needs to be selected in order to proceed.',
      );
      return;
    }

    const existingSettings = CreateDeviceStorage.fromLocalstorage();
    existingSettings.deviceType = this.deviceType;

    await existingSettings.saveToLocalStorage();

    this.router.navigate([
      `/dashboard/${getDashboardId(window.location.href)}/settings/create-device/2`,
    ]);
  }

  public onFileChange(evt: any) {
    this.projectImage = evt.target.files[0];
  }

  ngOnInit() {
    const existingSettings = CreateDeviceStorage.fromLocalstorage();
    this.deviceType =
      DeviceType[existingSettings.deviceType as keyof typeof DeviceType];
  }
}

enum DeviceType {
  TTN = 'TheThingsNetwork device',
  WIFIANDLTE = 'Wifi and or LTE device using MQTT',
  CAMERA = 'Camera',
  GATEWAY = 'Gateway',
}
