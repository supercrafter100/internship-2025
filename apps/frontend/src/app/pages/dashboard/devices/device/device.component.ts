import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../../../services/device.service';
import { Device } from '../../../../Interfaces/iDevice';
import { DeviceType } from '../../../../../types/types';

@Component({
  selector: 'app-device',
  standalone: false,
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
})
export class DashboardDeviceComponent implements OnInit {
  public device: Device | null = null;
  public deviceType: DeviceType | null = null;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const deviceId = params['deviceId'];
      const projectId = params['id'];

      const device = await this.deviceService.getDevice(deviceId);
      if (!device) {
        this.router.navigate(['/dashboard/' + projectId + '/devices']);
      }

      this.device = device;

      // Dynamically load the right component based on the device type
      const deviceType = device?.deviceType as string;

      // The deviceType variable contains the value of the corresponding enum
      // we have to use it to get the correct DeviceType enum, so for example it is Wifi or LTE device using MQTT and
      // it has to be DeviceType.MQTT
      const type = this.toDeviceType(deviceType);
      if (!type) {
        console.error('Invalid device type:', deviceType);
        return;
      }
      console.log(type);

      this.deviceType = type;
    });
  }

  isMqttDevice(): boolean {
    return (
      this.deviceType === DeviceType.MQTT || this.deviceType === DeviceType.TTN
    );
  }

  isCameraDevice(): boolean {
    return this.deviceType === DeviceType.CAMERA;
  }

  toDeviceType(value: string): DeviceType | undefined {
    return (Object.values(DeviceType) as string[]).includes(value)
      ? (value as DeviceType)
      : undefined;
  }
}
