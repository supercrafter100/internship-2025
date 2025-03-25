import { DeviceType } from '../../types/types';
import { toBase64 } from '../../util/utils';

// Abstracte klasse voor apparaat opslag
export abstract class CreateDevice {
  public deviceType!: DeviceType;
  public deviceName = '';
  public deviceImage: File | string | undefined;
  public deviceDescription = '';
  public latitude!: Number;
  public longitude!: Number;

  // Abstracte methode voor het laden van gegevens uit localStorage
  public abstract fromLocalstorage(): CreateDevice;

  // Abstracte methode voor het opslaan naar localStorage
  public abstract saveToLocalStorage(): Promise<void>;

  public abstract toJsonObject(): any;

  public static clear() {
    localStorage.removeItem('create-device-storage');
    localStorage.removeItem('device-type');
  }
}
