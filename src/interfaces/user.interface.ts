import { IMoodEntries } from './mood.entries.interface';

export interface IUser {
  email: string;
  password: string;
  name: string;
  imageUrl: string;
  moodEntries: IMoodEntries[];
}
