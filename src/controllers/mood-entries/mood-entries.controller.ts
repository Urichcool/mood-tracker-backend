import { Body, Controller, Post } from '@nestjs/common';
import { CreateMoodEntryDto } from 'src/Dto/mood-entry.dto';
import { MoodEntriesService } from 'src/services/mood-entries/mood-entries.service';

@Controller('mood-entries')
export class MoodEntriesController {
  constructor(private moodEntriesService: MoodEntriesService) {}

  @Post('create')
  CreateMoodEntry(@Body() body: CreateMoodEntryDto) {
    this.moodEntriesService.addMoodEntry(body.id, body.moodEntry);
  }
}
