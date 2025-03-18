import { toBase64 } from '../../util/utils';

export class CreateDeviceStorage {
  public deviceName = '';
  public deviceImage: File | string | undefined;
  public deviceXCoordinates = '';
  public deviceYCoordinates = '';
  public deviceType = '';

  public static fromLocalstorage(): CreateDeviceStorage {
    const fromLocalStorage = localStorage.getItem('create-device-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new CreateDeviceStorage();
      storage.deviceName = json.projectName;

      if (json.projectImage) {
        // project image is base64 encoded, so we need to create a file from i
        storage.deviceImage = json.projectImage;
      }

      storage.deviceType = json.deviceType;
      storage.deviceXCoordinates = json.deviceXCoordinates;
      storage.deviceYCoordinates = json.deviceYCoordinates;

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
    };
    localStorage.setItem('create-project-storage', JSON.stringify(json));
  }

  public static clear() {
    localStorage.removeItem('create-project-storage');
  }
}
