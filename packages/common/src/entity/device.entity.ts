import { Devicetype } from "../enums/devicetype.entity";

export class Device {
  public id!: number;
  public projectId!: number;
  public name!: string;
  public latitude!: string;
  public longitude!: string;
  public imgKey!: string;
  public createdAt!: Date;
  public type!: Devicetype; // Aangepast naar string tenzij je een enum gebruikt
  public protocol!: string; // Aangepast naar string tenzij je een enum gebruikt
  public videos!: any[]; // Vervang met een specifiek type als je een Video-class hebt

  public static fromJson(json: any): Device {
    const device = new Device();
    device.id = json.id;
    device.projectId = json.projectId;
    device.name = json.name;
    device.latitude = json.latitude;
    device.longitude = json.longitude;
    device.imgKey = json.imgKey;
    device.createdAt = new Date(json.createdAt);
    device.type = json.type;
    device.protocol = json.protocol;
    device.videos = json.videos || [];
    return device;
  }
}
