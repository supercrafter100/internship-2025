import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTtnCredDto {
  @IsNotEmpty()
  @IsString()
  appUrl: string;
  @IsNotEmpty()
  @IsString()
  appId: string;
  @IsNotEmpty()
  @IsString()
  apiKey: string;
  @IsNotEmpty()
  createdByid: number;
}
