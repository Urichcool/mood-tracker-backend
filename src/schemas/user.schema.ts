import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MoodEntries } from './mood-entries.schema';

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  imageUrl: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: [MoodEntries] })
  moodEntries: MoodEntries[];
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
