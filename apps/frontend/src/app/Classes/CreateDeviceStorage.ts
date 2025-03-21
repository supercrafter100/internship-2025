import { DeviceType } from '../../types/types';
import { toBase64 } from '../../util/utils';

export class CreateDeviceStorage {
  public deviceName = '';
  public deviceImage: File | string | undefined;
  public deviceType!: DeviceType;
  public deviceDescription = '';
  public latitude!: Number;
  public longitude!: Number;

  public static fromLocalstorage(): CreateDeviceStorage {
    const fromLocalStorage = localStorage.getItem('create-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new CreateDeviceStorage();
      storage.deviceName = json.deviceName;

      if (json.deviceImage) {
        // device image is base64 encoded, so we need to create a file from it
        storage.deviceImage = json.deviceImage;
      }

      storage.deviceType = json.deviceType;
      storage.deviceDescription = json.deviceDescription;
      storage.latitude = json.latitude;
      storage.longitude = json.longitude;

      return storage;
    }

    return new CreateDeviceStorage();
  }

  public async saveToLocalStorage() {
    const deviceImage =
      this.deviceImage instanceof File
        ? await toBase64(this.deviceImage)
        : this.deviceImage;
    const json = {
      deviceName: this.deviceName,
      deviceImage,
      deviceType: this.deviceType,
      deviceDescription: this.deviceDescription,
      latitude: this.latitude,
      longitude: this.longitude,
    };
    localStorage.setItem('create-device-storage', JSON.stringify(json));
  }

  public static clear() {
    localStorage.removeItem('create-device-storage');
  }
}
