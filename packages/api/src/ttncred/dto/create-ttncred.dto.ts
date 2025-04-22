import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTtnCredDto {
  @IsNotEmpty()
  projectId: number;
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
