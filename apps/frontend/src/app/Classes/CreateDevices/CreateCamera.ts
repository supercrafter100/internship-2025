import { DeviceType } from '../../../types/types';
import { toBase64 } from '../../../util/utils';
import { CreateDevice } from '../CreateDevice';

// Camera apparaat specifieke klasse
export class CameraDeviceStorage extends CreateDevice {
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
    };
  }

  constructor() {
    super();
    this.deviceType = DeviceType.CAMERA;
    this.deviceParameters = [{ name: '', description: '' }];
  }

  // Parameters for Camera device
  public deviceParameters: { name: string; description: string }[] = [];

  // Static method for loading data from localStorage
  public static fromLocalstorage(): CreateDevice {
    const fromLocalStorage = localStorage.getItem('camera-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new CameraDeviceStorage();
      storage.deviceId = json.deviceId;
      storage.deviceName = json.deviceName;
      storage.deviceImage = json.deviceImage;
      storage.deviceDescription = json.deviceDescription;
      storage.latitude = json.latitude;
      storage.longitude = json.longitude;
      storage.projectId = json.projectId;
      storage.deviceType = json.deviceType;

      return storage;
    }

    return new CameraDeviceStorage();
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
      projectId: this.projectId,
      deviceType: this.deviceType,
    };
    localStorage.setItem('camera-device-storage', JSON.stringify(json));
  }
}
