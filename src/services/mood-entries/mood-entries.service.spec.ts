import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MoodEntriesService } from './mood-entries.service';
import { User } from 'src/schemas/user.schema';
import { IMoodEntries } from 'src/interfaces/mood.entries.interface';

describe('MoodEntriesService', () => {
  let service: MoodEntriesService;

  const mockUserModel = {
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodEntriesService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<MoodEntriesService>(MoodEntriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('addMoodEntry', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const mockId = 'user-id-123';
      const mockEntry: IMoodEntries = {
        createdAt: '2025-03-20T09:00:00Z',
        mood: 2,
        feelings: ['Joyful', 'Motivated', 'Hopeful'],
        journalEntry: 'Had an amazing morning run and feel full of energy!',
        sleepHours: 7.5,
      };
      const mockResult = { success: true };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockResult);

      const result = await service.addMoodEntry(mockId, mockEntry);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockId, {
        $push: { moodEntries: mockEntry },
      });
      expect(result).toBe(mockResult);
    });

    it('should return null if update fails', async () => {
      const mockId = 'user-id-123';
      const mockEntry: IMoodEntries = {
        createdAt: '2025-03-20T09:00:00Z',
        mood: 2,
        feelings: ['Joyful', 'Motivated', 'Hopeful'],
        journalEntry: 'Had an amazing morning run and feel full of energy!',
        sleepHours: 7.5,
      };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await service.addMoodEntry(mockId, mockEntry);

      expect(result).toBeNull();
    });
  });
});
