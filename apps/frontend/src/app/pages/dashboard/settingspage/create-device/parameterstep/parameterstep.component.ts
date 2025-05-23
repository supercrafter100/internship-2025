import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeviceType } from '../../../../../../types/types';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
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
    CreateDeviceStorage.getDeviceStorage() as MqttDeviceStorage;

  private projectId: number | undefined;

  public loading = false;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
    private readonly deviceService: DeviceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    if (!this.deviceStorage) {
      this.toast.error('Device settings not found.');
      throw new Error('Device settings not found.');
    }
    this.route.paramMap.subscribe((params) => {
      this.projectId = Number(params.get('id'));
      console.log('Project ID: ', this.projectId);
    });

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
    if (this.projectId !== undefined) {
      this.deviceStorage.projectId = this.projectId;
    } else {
      this.toast.error('Project ID is undefined.');
      return;
    }
    await this.deviceStorage.saveToLocalStorage();

    const nextRoute =
      this.deviceStorage.deviceType === DeviceType.TTN
        ? '/3.1'
        : this.deviceStorage.deviceType === DeviceType.MQTT
          ? '/3.2'
          : '';

    if (nextRoute) {
      // Save the device to the backend
      this.loading = true;
      let res = await this.deviceService.postDevice(this.deviceStorage);
      this.loading = false;
      if (res.status !== 201) {
        this.toast.error('Error saving device to backend');
        return;
      } else {
        this.toast.success('Device saved to backend');
        if (!res.body) {
          this.toast.error('Device ID not found in response');
          return;
        } else {
          let resJson = await res.json();

          this.deviceStorage.deviceId = resJson.id;
          this.deviceStorage.deviceImage = resJson.imgKey;

          await this.deviceStorage.saveToLocalStorage();
        }
      }
      console.log('Device saved to backend');
      this.router.navigate([
        document.location.pathname.slice(0, -4) + nextRoute,
      ]);
    }
  }
}
