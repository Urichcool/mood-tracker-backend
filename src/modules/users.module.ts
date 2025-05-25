import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from 'src/controllers/users-controller/users.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ImageService } from 'src/services/users/image.service';
import { UsersService } from 'src/services/users/users.service';
import { CloudinaryModule } from './cloudinary.module';
import { AuthService } from 'src/services/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'Users' },
    ]),
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ImageService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
