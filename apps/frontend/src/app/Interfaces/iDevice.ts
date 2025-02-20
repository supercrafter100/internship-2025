export enum Transfer_protocol {
  Wifi,
  LoraWan,
  LTE,
}

export enum Device_Type {
  WIM,
  ROB,
  GATE,
}

export interface Device {
  id: string;
  name: string;
  img_id: string;
  creation_date: string;
  latitude: string;
  longitude: string;
  transfer_protocol: Transfer_protocol;
  device_type: Device_Type;
}

export interface WimReading {
  id: number;
  voltage: number;
  tippings: number;
  temperature: number;
  humidity: number;
  pressure: number;
}
