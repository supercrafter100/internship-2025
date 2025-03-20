import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { getDashboardId } from '../../../../../../util/utils';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';

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

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async submit() {
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

    const existingSettings = CreateDeviceStorage.fromLocalstorage();
    existingSettings.deviceName = this.deviceName;
    existingSettings.deviceDescription = this.deviceDescription;
    existingSettings.deviceImage = this.deviceImage;
    existingSettings.latitude = this.latitude;
    existingSettings.longitude = this.longitude;
    await existingSettings.saveToLocalStorage();
    this.router.navigate(['']);
  }

  public onFileChange(evt: any) {
    this.deviceImage = evt.target.files[0];
  }

  ngOnInit() {
    const existingSettings = CreateDeviceStorage.fromLocalstorage();
    this.deviceName = existingSettings.deviceName;
    this.deviceDescription = existingSettings.deviceDescription;
    this.deviceImage = existingSettings.deviceImage;
    this.latitude = existingSettings.latitude;
    this.longitude = existingSettings.longitude;
  }
}
