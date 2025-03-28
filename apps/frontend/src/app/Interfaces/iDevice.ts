export enum Transfer_protocol {
  WIFI,
  LoraWan,
  LTE,
}

export enum Device_Type {
  WIMV1,
  ROB,
  GATE,
}

export interface Device {
  id: string;
  name: string;
  imgKey: string;
  createdAt: string;
  latitude: string;
  longitude: string;
  protocol: Transfer_protocol;
  type: Device_Type;
}

export interface WimReading {
  id: number;
  voltage: number;
  tippings: number;
  temperature: number;
  humidity: number;
  pressure: number;
}
