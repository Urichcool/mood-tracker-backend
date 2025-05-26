import {
  IsString,
  IsEmail,
  ValidateNested,
  IsDefined,
  IsArray,
} from 'class-validator';
import { MoodEntryDto } from './mood-entry.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  imageUrl: string;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MoodEntryDto)
  moodEntries: MoodEntryDto[];
}

export class UpdateUserNameDto {
  @IsString()
  @IsDefined()
  id: string;

  @IsString()
  @IsDefined()
  updatedName: string;

  @IsEmail()
  @IsDefined()
  email: string;
}

export class UpdateUserPictureDto {
  @IsString()
  @IsDefined()
  id: string;

  @IsEmail()
  @IsDefined()
  email: string;
}
