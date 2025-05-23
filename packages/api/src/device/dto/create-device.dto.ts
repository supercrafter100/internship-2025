import { IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  deviceType: string;

  @IsNotEmpty()
  deviceName: string;

  @IsNotEmpty()
  deviceImage: string;

  @IsNotEmpty()
  deviceDescription: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  deviceParameters: { name: string; description: string }[];

  sendsFirstParamTimestamp: boolean;
}
