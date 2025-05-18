import { IMoodEntries } from './mood.entries.interface';

export interface IUser {
  email: string;
  password: string;
  name: string;
  imageLink: string;
  moodEntries: IMoodEntries[];
}
