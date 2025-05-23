import { CreateDevice } from './CreateDevice';
import { MqttDeviceStorage } from './CreateDevices/CreateMQTTDevice';
import { DeviceType } from '../../types/types';
import { TtnDeviceStorage } from './CreateDevices/CreateTTNDevice';
import { CameraDeviceStorage } from './CreateDevices/CreateCamera';

// Base class for all devices
export class CreateDeviceStorage {
  public static getDeviceStorage(): CreateDevice | undefined {
    let deviceType = localStorage.getItem('deviceType') as DeviceType;

    switch (deviceType) {
      case DeviceType.MQTT:
        return MqttDeviceStorage.fromLocalstorage();
      case DeviceType.TTN:
        return TtnDeviceStorage.fromLocalstorage();
      case DeviceType.CAMERA:
        return CameraDeviceStorage.fromLocalstorage();
      default:
        break;
    }

    return undefined;
  }
}
