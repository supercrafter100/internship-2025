import { DeviceType } from '../../../types/types';
import { toBase64 } from '../../../util/utils';
import { CreateDevice } from '../CreateDevice';

// MQTT apparaat specifieke klasse
export class MqttDeviceStorage extends CreateDevice {
  public override toJsonObject() {
    return {
      deviceName: this.deviceName,
      deviceImage: this.deviceImage,
      deviceDescription: this.deviceDescription,
      latitude: this.latitude,
      longitude: this.longitude,
      deviceParameters: this.deviceParameters,
    };
  }

  constructor() {
    super();
    this.deviceType = DeviceType.MQTT;
    this.deviceParameters = [{ name: '', description: '' }];
  }

  public fromLocalstorage(): CreateDevice {
    const fromLocalStorage = localStorage.getItem('mqtt-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      this.deviceName = json.deviceName;
      this.deviceParameters = json.deviceParameters;
      this.deviceImage = json.deviceImage;
      this.deviceDescription = json.deviceDescription;
      this.latitude = json.latitude;
      this.longitude = json.longitude;
    }
    return this;
  }

  // Parameters for MQTT device
  public deviceParameters: { name: string; description: string }[] = [];

  // Static method for loading data from localStorage
  public static fromLocalstorage(): CreateDevice {
    const fromLocalStorage = localStorage.getItem('mqtt-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new MqttDeviceStorage();
      storage.deviceName = json.deviceName;
      storage.deviceParameters = json.deviceParameters;
      storage.deviceImage = json.deviceImage;
      storage.deviceDescription = json.deviceDescription;
      storage.latitude = json.latitude;
      storage.longitude = json.longitude;

      return storage;
    }

    return new MqttDeviceStorage();
  }

  // Save to localStorage method
  public async saveToLocalStorage(): Promise<void> {
    const deviceImage =
      this.deviceImage instanceof File
        ? await toBase64(this.deviceImage)
        : this.deviceImage;
    const json = {
      deviceName: this.deviceName,
      deviceImage,
      deviceDescription: this.deviceDescription,
      latitude: this.latitude,
      longitude: this.longitude,
      deviceParameters: this.deviceParameters,
    };
    localStorage.setItem('mqtt-device-storage', JSON.stringify(json));
  }
}
