import { Component } from '@angular/core';
import { CameraDeviceStorage } from '../../../../../../Classes/CreateDevices/CreateCamera';
import { CreateDeviceStorage } from '../../../../../../Classes/CreateDeviceStorage';
import { HotToastService } from '@ngneat/hot-toast';
import { DeviceService } from '../../../../../../services/device.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  standalone: false,
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent {
  cameraUsername: string = 'video';
  cameraPassword: string = 'AjtSu7cmQaXB4Jv5KMwseq';
  cameraBucket: string = 'bsaffer';
  cameraDirectory: string = 'videos/ugandatest/<datum>.mp4';
  cameraEndpoint: string = 'https://minio-prod.bsaffer.iot-ap.be/';

  constructor(
    private deviceService: DeviceService,
    private toast: HotToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public async next() {
    const existingSettings =
      CreateDeviceStorage.getDeviceStorage() as CameraDeviceStorage;
    if (existingSettings === undefined) {
      this.toast.error('Device settings not found.');
      return;
    }

    // retrieve the project ID from the URL
    const projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) {
      throw new Error('Something went terribly wrong');
    }
    existingSettings.projectId = +projectId;
    await existingSettings.saveToLocalStorage();

    let res = await this.deviceService.postDevice(existingSettings);
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

        existingSettings.deviceId = resJson.id;
        existingSettings.deviceImage = resJson.imgKey;

        await existingSettings.saveToLocalStorage();

        this.router.navigate(['../finish'], { relativeTo: this.route });
      }
    }
  }
}
