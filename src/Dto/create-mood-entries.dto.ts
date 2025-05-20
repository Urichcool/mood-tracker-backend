import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateMoodEntriesDto {
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
