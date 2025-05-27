import { Test, TestingModule } from '@nestjs/testing';
import { MoodEntriesService } from './mood-entries.service';

describe('MoodEntriesService', () => {
  let service: MoodEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodEntriesService],
    }).compile();

    service = module.get<MoodEntriesService>(MoodEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
