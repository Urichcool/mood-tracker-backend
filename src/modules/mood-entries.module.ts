import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodEntriesController } from 'src/controllers/mood-entries/mood-entries.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MoodEntriesService } from 'src/services/mood-entries/mood-entries.service';
import { UsersService } from 'src/services/users/users.service';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'Users' },
    ]),
    CloudinaryModule,
  ],
  controllers: [MoodEntriesController],
  providers: [MoodEntriesService, UsersService],
  exports: [MoodEntriesService],
})
export class MoodEntriesModule {}
