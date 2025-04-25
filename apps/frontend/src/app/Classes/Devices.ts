import {
  Device,
  Device_Type,
  Transfer_protocol,
  WimReading,
} from '../Interfaces/iDevice';
import { DeviceService } from '../services/device.service';

class WimSensor {
  constructor(
    readonly deviceservice: DeviceService,
    readonly id: string,
    readonly name: string,
    readonly img_id: string,
    readonly creation_date: string,
    readonly latitude: string,
    readonly longitude: string,
    readonly transfer_protocol: Transfer_protocol,
    readonly device_type: Device_Type,
  ) {}

  async getReading(start: Date, end: Date): Promise<WimReading[]> {
    return this.deviceservice.getReading<WimReading[]>(this.id, start, end);
  }
}
