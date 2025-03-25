import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeviceType } from '../../../../../../types/types';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { DeviceService } from '../../../../../services/device.service';
import { MqttDeviceStorage } from '../../../../../Classes/CreateDevices/CreateMQTTDevice';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';

@Component({
  selector: 'app-parameterstep',
  standalone: false,
  templateUrl: './parameterstep.component.html',
  styleUrl: './parameterstep.component.css',
})
export class ParameterstepComponent implements OnInit {
  parameters: { name: string; description: string }[] = [];
  private deviceStorage =
    CreateDeviceStorage.newDeviceStorage() as MqttDeviceStorage;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
    private readonly deviceService: DeviceService,
  ) {}

  ngOnInit() {
    if (!this.deviceStorage) {
      this.toast.error('Device settings not found.');
      throw new Error('Device settings not found.');
    }

    this.deviceStorage = this.deviceStorage as MqttDeviceStorage;
    this.parameters = this.deviceStorage.deviceParameters;
  }

  addParameter() {
    this.parameters.push({ name: '', description: '' });
  }

  removeParameter(index: number) {
    this.parameters.splice(index, 1);
  }

  onDrop(event: CdkDragDrop<{ name: string; description: string }[]>) {
    moveItemInArray(this.parameters, event.previousIndex, event.currentIndex);
  }

  async next() {
    if (!this.deviceStorage) {
      this.toast.error('Device settings not found.');
      return;
    }

    // Save the parameters to the device storage
    this.deviceStorage.deviceParameters = this.parameters;
    await this.deviceStorage.saveToLocalStorage();

    const nextRoute =
      this.deviceStorage.deviceType === DeviceType.TTN
        ? '/3.1'
        : this.deviceStorage.deviceType === DeviceType.MQTT
          ? '/3.2'
          : '';

    if (nextRoute) {
      this.router.navigate([
        document.location.pathname.slice(0, -4) + nextRoute,
      ]);
    }
  }
}
