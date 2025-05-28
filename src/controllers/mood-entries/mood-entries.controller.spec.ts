import { Test, TestingModule } from '@nestjs/testing';
import { MoodEntriesController } from './mood-entries.controller';
import { MoodEntriesService } from 'src/services/mood-entries/mood-entries.service';
import { CreateMoodEntryDto } from 'src/Dto/mood-entry.dto';

describe('MoodEntriesController', () => {
  let controller: MoodEntriesController;

  const mockMoodEntriesService = {
    addMoodEntry: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodEntriesController],
      providers: [
        {
          provide: MoodEntriesService,
          useValue: mockMoodEntriesService,
        },
      ],
    }).compile();

    controller = module.get<MoodEntriesController>(MoodEntriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateMoodEntry', () => {
    it('should call moodEntriesService.addMoodEntry with correct parameters and return a success message', async () => {
      const dto: CreateMoodEntryDto = {
        id: 'user123',
        moodEntry: {
          createdAt: '2025-03-20T09:00:00Z',
          mood: 2,
          feelings: ['Joyful', 'Motivated', 'Hopeful'],
          journalEntry: 'Had an amazing morning run and feel full of energy!',
          sleepHours: 7.5,
        },
      };

      mockMoodEntriesService.addMoodEntry.mockResolvedValue(undefined);

      const result = await controller.CreateMoodEntry(dto);

      expect(mockMoodEntriesService.addMoodEntry).toHaveBeenCalledWith(
        dto.id,
        dto.moodEntry,
      );
      expect(result).toEqual({ message: 'mood entry created' });
    });
  });
});
