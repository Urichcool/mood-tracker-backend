import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMoodEntries } from 'src/interfaces/mood.entries.interface';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class MoodEntriesService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async addMoodEntry(
    id: string,
    moodEntry: IMoodEntries,
  ): Promise<object | null> {
    try {
      return await this.UserModel.findByIdAndUpdate(id, {
        $push: {
          moodEntries: moodEntry,
        },
      });
    } catch {
      throw new NotFoundException(`User with id:${id} not found`);
    }
  }
}
