import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @Length(1, 15)
  title: string;

  @IsNotEmpty()
  @Length(1, 35)
  shortDescription: string;

  userId: number;

  @IsNotEmpty()
  @IsBoolean()
  public: boolean;

  @IsNotEmpty()
  @IsString()
  base64Image: string;

  @IsNotEmpty()
  @IsString()
  story: string;
}
