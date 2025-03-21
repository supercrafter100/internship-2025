export interface MapPoint {
  coordinates: number[];
  name: string;
  link?: string | string[];
  image?: string;
}

export enum DeviceType {
  TTN = 'TheThingsNetwork device',
  WIFIANDLTE = 'Wifi or LTE device using MQTT',
  CAMERA = 'Camera',
  GATEWAY = 'Gateway',
}
