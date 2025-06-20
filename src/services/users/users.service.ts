import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/interfaces/user.interface';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ImageService } from '../images/image.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly imageService: ImageService,
  ) {}

  create(user: IUser): Promise<object | null> {
    try {
      const createdUser = new this.UserModel(user);
      return createdUser.save();
    } catch {
      throw new BadRequestException('Failed to create document');
    }
  }

  async updateName(id: string, updatedName: string): Promise<object | null> {
    try {
      return await this.UserModel.findByIdAndUpdate(id, { name: updatedName });
    } catch {
      throw new BadRequestException("Failed to update user's name");
    }
  }

  async updateImage(
    id: string,
    updatedPicture: Express.Multer.File,
  ): Promise<void | null> {
    try {
      const result: UploadApiResponse | undefined =
        await this.imageService.uploadToCloudinary(updatedPicture);
      if (result) {
        const imageUrl: string = result.secure_url;
        return this.UserModel.findByIdAndUpdate(id, { imageUrl: imageUrl });
      }
    } catch {
      throw new BadRequestException("Failed to update user's image");
    }
  }

  async findUserByEmail(email: string): Promise<object | null> {
    return await this.UserModel.findOne({ email });
  }

  async findUserById(id: string): Promise<object | null> {
    return await this.UserModel.findById(id);
  }

  async setRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.UserModel.findByIdAndUpdate(userId, {
      refreshToken: hashedToken,
    });
  }
}
