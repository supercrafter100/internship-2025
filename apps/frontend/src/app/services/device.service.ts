import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Device } from '../Interfaces/iDevice';
import { DeviceType } from '../../types/types';
import { CreateDevice } from '../Classes/CreateDevice';
import { MqttDeviceStorage } from '../Classes/CreateDevices/CreateMQTTDevice';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = environment.apiUrl;

  public getReading<T>(id: string, start: Date, end: Date) {
    return fetch(
      this.apiUrl + '/' + id + '/' + start.getTime() + end.getTime(),
    ).then((res) => res.json() as Promise<T>);
  }

  public getDevicesForProject(projectId: number) {
    return fetch(this.apiUrl + '/devices/project/' + projectId).then(
      (res) => res.json() as Promise<Device[]>,
    );
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
}
