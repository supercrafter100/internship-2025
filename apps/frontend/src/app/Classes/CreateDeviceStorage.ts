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
        break;

      case DeviceType.TTN:
        return TtnDeviceStorage.fromLocalstorage();
        break;
      case DeviceType.CAMERA:
        return CameraDeviceStorage.fromLocalstorage();
        return;
      default:
        break;
    }

    return undefined;
  }
}
