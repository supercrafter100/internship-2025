import { Component } from '@angular/core';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { getDashboardId } from '../../../../../../util/utils';
import { DeviceType } from '../../../../../../types/types';
import { DeviceService } from '../../../../../services/device.service';

@Component({
  selector: 'app-first',
  standalone: false,
  templateUrl: './first.component.html',
  styleUrl: './first.component.css',
})
export class FirstComponent {
  public allDeviceTypes = Object.values(DeviceType);
  public deviceType: DeviceType | undefined;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
    private deviceService: DeviceService,
  ) {}

  public async submit() {
    if (!this.deviceType) {
      this.toast.error(
        'A device type needs to be selected in order to proceed.',
      );
      return;
    }

    // Set the device type and create a new type storage
    localStorage.setItem('deviceType', this.deviceType);

    this.router.navigate([
      `/dashboard/${getDashboardId(window.location.href)}/settings/create-device/2`,
    ]);
  }

  ngOnInit() {
    this.deviceType = localStorage.getItem('deviceType') as DeviceType;
  }
}
