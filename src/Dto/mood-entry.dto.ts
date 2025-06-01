import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class MoodEntryDto {
  @IsString()
  @ApiProperty({ example: '2025-03-20T09:00:00Z' })
  createdAt: string;

  @IsNumber()
  @ApiProperty({ example: 2 })
  mood: number;

  @IsArray()
  @ApiProperty({ example: 2 })
  @IsString({ each: true })
  @ApiProperty({ example: ['Joyful', 'Motivated', 'Hopeful'] })
  feelings: string[];

  @IsString()
  @ApiProperty({
    example: 'Had an amazing morning run and feel full of energy!',
  })
  journalEntry: string;

  @IsNumber()
  @ApiProperty({
    example: 7,
  })
  sleepHours: number;
}

export class CreateMoodEntryDto {
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'exampleid' })
  id: string;

  @IsObject()
  @IsDefined()
  @ApiProperty({
    example: {
      createdAt: '2025-03-20T09:00:00Z',
      mood: 2,
      feelings: ['Joyful', 'Motivated', 'Hopeful'],
      journalEntry: 'Had an amazing morning run and feel full of energy!',
      sleepHours: 7.5,
    },
  })
  moodEntry: MoodEntryDto;
}
