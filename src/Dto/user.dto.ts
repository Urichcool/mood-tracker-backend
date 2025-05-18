import {
  IsString,
  IsEmail,
  ValidateNested,
  IsDefined,
  IsArray,
} from 'class-validator';
import { CreateMoodEntriesDto } from './create-mood-entries.dto';
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
  imageLink: string;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateMoodEntriesDto)
  moodEntries: CreateMoodEntriesDto[];
}

export class UpdateUserDto {
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
