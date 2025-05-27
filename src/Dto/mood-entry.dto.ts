import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class MoodEntryDto {
  @IsString()
  createdAt: string;

  @IsNumber()
  mood: number;

  @IsArray()
  @IsString({ each: true })
  feelings: string[];

  @IsString()
  journalEntry: string;

  @IsNumber()
  sleepHours: number;
}

export class CreateMoodEntryDto {
  @IsString()
  @IsDefined()
  id: string;

  @IsObject()
  @IsDefined()
  moodEntry: MoodEntryDto;
}
