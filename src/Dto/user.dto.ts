import {
  IsString,
  IsEmail,
  ValidateNested,
  IsDefined,
  IsArray,
} from 'class-validator';
import { MoodEntryDto } from './mood-entry.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ example: '1235!' })
  @IsString()
  @IsDefined()
  password: string;

  @ApiProperty({ example: 'john' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ example: 'http://www.exampleurl.com' })
  @IsString()
  @IsDefined()
  imageUrl: string;

  @ApiProperty({
    example: [
      {
        createdAt: '2025-03-20T09:00:00Z',
        mood: 2,
        feelings: ['Joyful', 'Motivated', 'Hopeful'],
        journalEntry: 'Had an amazing morning run and feel full of energy!',
        sleepHours: 7.5,
      },
    ],
  })
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MoodEntryDto)
  moodEntries: MoodEntryDto[];
}

export class UpdateUserNameDto {
  @ApiProperty({ example: 'exampleid' })
  @IsString()
  @IsDefined()
  id: string;

  @ApiProperty({ example: 'Bob' })
  @IsString()
  @IsDefined()
  updatedName: string;

  @ApiProperty({ example: 'bob@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;
}

export class UpdateUserPictureDto {
  @ApiProperty({ example: 'exampleid' })
  @IsString()
  @IsDefined()
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;
}
