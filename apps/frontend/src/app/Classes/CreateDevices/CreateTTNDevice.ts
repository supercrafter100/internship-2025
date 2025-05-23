import { DeviceType } from '../../../types/types';
import { toBase64 } from '../../../util/utils';
import { CreateDevice } from '../CreateDevice';

// TTN apparaat specifieke klasse
export class TtnDeviceStorage extends CreateDevice {
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
      ttnProviderId: this.ttnProviderId,
      ttnDeviceId: this.ttnDeviceId,
      sendsFirstParamTimestamp: this.sendsFirstParamTimestamp,
    };
  }

  constructor() {
    super();
    this.deviceType = DeviceType.TTN;
    this.deviceParameters = [{ name: '', description: '' }];
  }

  // Parameters for TTN device
  public deviceParameters: { name: string; description: string }[] = [];
  public ttnProviderId = -1;
  public ttnDeviceId = '';

  // Static method for loading data from localStorage
  public static fromLocalstorage(): CreateDevice {
    const fromLocalStorage = localStorage.getItem('ttn-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new TtnDeviceStorage();
      storage.deviceId = json.deviceId;
      storage.deviceName = json.deviceName;
      storage.deviceParameters = json.deviceParameters;
      storage.deviceImage = json.deviceImage;
      storage.deviceDescription = json.deviceDescription;
      storage.latitude = json.latitude;
      storage.longitude = json.longitude;
      storage.projectId = json.projectId;
      storage.deviceType = json.deviceType;
      storage.ttnDeviceId = json.ttnDeviceId;
      storage.ttnProviderId = json.ttnProviderId;
      storage.sendsFirstParamTimestamp = json.sendsFirstParamTimestamp;
      return storage;
    }

    return new TtnDeviceStorage();
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
      ttnDeviceId: this.ttnDeviceId,
      ttnProviderId: this.ttnProviderId,
      sendsFirstParamTimestamp: this.sendsFirstParamTimestamp,
    };
    localStorage.setItem('ttn-device-storage', JSON.stringify(json));
  }
}
