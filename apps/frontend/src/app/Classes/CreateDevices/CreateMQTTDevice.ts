import { DeviceType } from '../../../types/types';
import { toBase64 } from '../../../util/utils';
import { CreateDevice } from '../CreateDevice';

// MQTT apparaat specifieke klasse
export class MqttDeviceStorage extends CreateDevice {
  public override toJsonObject() {
    return {
      projectId: this.projectId,
      deviceType: this.deviceType,
      deviceName: this.deviceName,
      deviceImage: this.deviceImage,
      deviceDescription: this.deviceDescription,
      latitude: this.latitude,
      longitude: this.longitude,
      deviceParameters: this.deviceParameters,
      sendsFirstParamTimestamp: this.sendsFirstParamTimestamp,
    };
  }

  constructor() {
    super();
    this.deviceType = DeviceType.MQTT;
    this.deviceParameters = [{ name: '', description: '' }];
  }

  // Parameters for MQTT device
  public deviceParameters: { name: string; description: string }[] = [];

  // Static method for loading data from localStorage
  public static fromLocalstorage(): CreateDevice {
    const fromLocalStorage = localStorage.getItem('mqtt-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new MqttDeviceStorage();
      storage.deviceId = json.deviceId;
      storage.deviceName = json.deviceName;
      storage.deviceParameters = json.deviceParameters;
      storage.deviceImage = json.deviceImage;
      storage.deviceDescription = json.deviceDescription;
      storage.latitude = json.latitude;
      storage.longitude = json.longitude;
      storage.projectId = json.projectId;
      storage.deviceType = json.deviceType;
      storage.sendsFirstParamTimestamp = json.sendsFirstParamTimestamp;

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
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      deviceImage,
      deviceDescription: this.deviceDescription,
      latitude: this.latitude,
      longitude: this.longitude,
      deviceParameters: this.deviceParameters,
      projectId: this.projectId,
      deviceType: this.deviceType,
      sendsFirstParamTimestamp: this.sendsFirstParamTimestamp,
    };
    localStorage.setItem('mqtt-device-storage', JSON.stringify(json));
  }
}
