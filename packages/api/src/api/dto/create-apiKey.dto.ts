import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;
}
