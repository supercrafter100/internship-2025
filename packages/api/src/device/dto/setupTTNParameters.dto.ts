import { IsNotEmpty } from 'class-validator';

export class SetupTTNParametersDTO {
  @IsNotEmpty()
  ttnDeviceId: string;

  @IsNotEmpty()
  ttnProviderId: number;
}
