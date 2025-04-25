export interface MapPoint {
  coordinates: number[];
  name: string;
  link?: string | string[];
  image?: string;
}

export enum DeviceType {
  TTN = 'TheThingsNetwork device',
  MQTT = 'Wifi or LTE device using MQTT',
  CAMERA = 'Camera',
  GATEWAY = 'Gateway',
}

export type MinioFile = {
  name: string;
  size: number;
};

export type TTNProvider = {
  id: number;
  projectId: number;
  appUrl: string;
  appId: string;
  apiKey: string;
  addedAt: Date;
};
