import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Device } from '../Interfaces/iDevice';
import { DeviceType, MinioFile } from '../../types/types';
import { CreateDevice } from '../Classes/CreateDevice';
import { MqttDeviceStorage } from '../Classes/CreateDevices/CreateMQTTDevice';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = environment.apiUrl;

  public getReadings<T>(id: string, start: string, end: string) {
    return fetch(
      this.apiUrl + '/devices/' + id + '/measurements/' + start + '/' + end,
    ).then((res) => res.json() as Promise<T>);
  }

  public getDevicesForProject(projectId: number) {
    return fetch(this.apiUrl + '/devices/project/' + projectId).then(
      (res) => res.json() as Promise<Device[]>,
    );
  }

  public async getDevice(id: string) {
    const res = await fetch(this.apiUrl + '/devices/' + id);
    if (res.status === 200) {
      return res.json() as Promise<Device>;
    } else {
      return null;
    }
  }

  public postDevice(device: CreateDevice) {
    return fetch(this.apiUrl + '/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(device.toJsonObject()),
    });
  }

  public async getDeviceVideos(id: string) {
    const res = await fetch(this.apiUrl + '/devices/' + id + '/videos');
    if (res.status === 200) {
      return res.json() as Promise<MinioFile[]>;
    } else {
      return null;
    }
  }

  public setTTNParameters(
    deviceId: string,
    ttnDeviceId: string,
    ttnProviderId: number,
  ) {
    return fetch(this.apiUrl + '/devices/' + deviceId + '/ttnParameters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ttnDeviceId,
        ttnProviderId,
      }),
    });
  }
}
