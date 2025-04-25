// Interface voor WimMeasurement
export interface WimMeasurement {
  result: string;
  table: number;
  _start: Date;
  _stop: Date;
  _time: Date;
  _value: number;
  _field: string;
  _measurement: string;
  device: string;
}
