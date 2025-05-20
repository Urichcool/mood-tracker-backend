import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/interfaces/user.interface';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ImageService } from './image.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly imageService: ImageService,
  ) {}

  create(user: IUser) {
    const createdUser = new this.UserModel(user);
    return createdUser.save();
  }

  updateName(id: string, updatedName: string) {
    return this.UserModel.findByIdAndUpdate(id, { name: updatedName });
  }

  async updateImage(id: string, updatedPicture: Express.Multer.File) {
    const result = await this.imageService.uploadToCloudinary(updatedPicture);
    if (result) {
      const imageUrl = result.secure_url;
      return this.UserModel.findByIdAndUpdate(id, { imageUrl: imageUrl });
    }
  }

  async findUser(email: string) {
    return this.UserModel.findOne({ email });
  }
}
