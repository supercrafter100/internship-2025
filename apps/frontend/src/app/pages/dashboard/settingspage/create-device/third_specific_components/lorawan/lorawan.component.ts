import { Component, OnInit } from '@angular/core';
import { TtnService } from '../../../../../../services/ttn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TTNProvider } from '../../../../../../../types/types';
import { HotToastService } from '@ngneat/hot-toast';
import { CreateDeviceStorage } from '../../../../../../Classes/CreateDeviceStorage';
import { TtnDeviceStorage } from '../../../../../../Classes/CreateDevices/CreateTTNDevice';
import { DeviceService } from '../../../../../../services/device.service';

@Component({
  selector: 'app-lorawan',
  standalone: false,
  templateUrl: './lorawan.component.html',
  styleUrl: './lorawan.component.css',
})
export class LorawanComponent implements OnInit {
  // List of TTN providers
  public ttnProviders: TTNProvider[] = [];

  // Selected TTN provider and device ID
  public ttnProvider: string | undefined;
  public ttnDeviceId: string = '';

  private ttnProviderId: number | undefined;

  constructor(
    private ttnService: TtnService,
    private readonly route: ActivatedRoute,
    private readonly toast: HotToastService,
    private readonly deviceService: DeviceService,
    private readonly router: Router,
  ) {}

  public onProviderChange() {
    // Get the selected TTN provider ID
    this.ttnProviderId = this.ttnProviders.find(
      (c) => c.appId === this.ttnProvider,
    )?.id;
  }

  public ngOnInit() {
    // Get the project ID from the URL
    this.route.paramMap.subscribe(async (params) => {
      const projectId = Number(params.get('id'));
      this.ttnProviders = await this.ttnService.getTTNProviders(projectId);
    });
  }

  public async next() {
    if (
      !this.ttnProviderId ||
      !this.ttnDeviceId ||
      this.ttnDeviceId.length < 5
    ) {
      this.toast.error(
        'Please select a TTN provider and have a device id that is longer than 5 characters',
        { position: 'top-center' },
      );
      return;
    }

    const existingSettings =
      CreateDeviceStorage.getDeviceStorage() as TtnDeviceStorage;
    if (existingSettings === undefined) {
      this.toast.error('Device settings not found.');
      return;
    }

    await this.deviceService.setTTNParameters(
      existingSettings.deviceId,
      this.ttnDeviceId,
      this.ttnProviderId,
    );
    this.router.navigate(['../finish'], { relativeTo: this.route });
  }
}
