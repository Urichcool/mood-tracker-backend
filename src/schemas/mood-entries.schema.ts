import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class MoodEntries {
  @Prop()
  createdAt: string;
  @Prop()
  mood: number;
  @Prop()
  feelings: string[];
  @Prop()
  journalEntry: string;
  @Prop()
  sleepHours: number;
}

export type MoodEntriesDocument = HydratedDocument<MoodEntries>;
export const MoodEntriesSchema = SchemaFactory.createForClass(MoodEntries);
