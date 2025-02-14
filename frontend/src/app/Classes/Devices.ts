import { Observable } from 'rxjs';
import { Device, Transfer_protocol, WimReading } from '../Interfaces/iDevice';
import { DeviceService } from '../services/device.service';

class WimSensor implements Device {
  constructor(
    readonly deviceservice: DeviceService,
    readonly id: string,
    readonly name: string,
    readonly img_id: string,
    readonly creation_date: string,
    readonly latitude: string,
    readonly longitude: string,
    readonly transfer_protocol: Transfer_protocol
  ) {}

  async getReading(start: Date, end: Date): Promise<WimReading[]> {
    return this.deviceservice.getReading<WimReading[]>(this.id, start, end);
  }
}

class Camera implements Device {
  id: string;
  name: string;
  img_id: string;
  creation_date: string;
  latitude: string;
  longitude: string;
  type: string = 'camera';
  transfer_protocol: Transfer_protocol;

  constructor(
    id: string,
    name: string,
    img_id: string,
    creation_date: string,
    latitude: string,
    longitude: string,
    transfer_protocol: Transfer_protocol
  ) {
    this.id = id;
    this.name = name;
    this.img_id = img_id;
    this.creation_date = creation_date;
    this.latitude = latitude;
    this.longitude = longitude;
    this.transfer_protocol = transfer_protocol;
  }

  async readValue(): Promise<string> {
    return `Image captured at ${new Date().toISOString()}`;
  }
}
