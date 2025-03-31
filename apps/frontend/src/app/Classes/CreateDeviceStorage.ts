import { CreateDevice } from './CreateDevice';
import { MqttDeviceStorage } from './CreateDevices/CreateMQTTDevice';
import { DeviceType } from '../../types/types';

// Base class for all devices
export class CreateDeviceStorage {
  public static getDeviceStorage(): CreateDevice | undefined {
    let deviceType = localStorage.getItem('deviceType') as DeviceType;

    switch (deviceType) {
      case DeviceType.MQTT:
        return MqttDeviceStorage.fromLocalstorage();
        break;
      default:
        break;
    }

    return undefined;
  }
}
