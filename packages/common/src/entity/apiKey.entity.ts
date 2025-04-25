import { Devicetype } from "../enums/devicetype.entity";

export class ApiKey {
  public id!: number;
  public projectId!: number;
  public name!: string;
  public key!: string;

  public static fromJson(json: any): ApiKey {
    const apiKey = new ApiKey();
    apiKey.id = json.id;
    apiKey.projectId = json.projectId;
    apiKey.name = json.name;
    apiKey.key = json.key;
    return apiKey;
  }
}
