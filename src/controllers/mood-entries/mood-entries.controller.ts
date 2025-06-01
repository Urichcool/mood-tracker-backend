import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateMoodEntryDto } from 'src/Dto/mood-entry.dto';
import { MoodEntriesService } from 'src/services/mood-entries/mood-entries.service';

@Controller('mood-entries')
export class MoodEntriesController {
  constructor(private moodEntriesService: MoodEntriesService) {}

  @Post('create')
  @ApiBody({ type: CreateMoodEntryDto })
  @ApiResponse({
    status: 201,
    description: 'Mood entry has been created.',
    example: {
      message: `mood entry created`,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async CreateMoodEntry(
    @Body() body: CreateMoodEntryDto,
  ): Promise<{ message: string }> {
    await this.moodEntriesService.addMoodEntry(body.id, body.moodEntry);
    return {
      message: `mood entry created`,
    };
  }
}
