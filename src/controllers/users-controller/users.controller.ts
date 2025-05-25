import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateUserDto,
  UpdateUserNameDto,
  UpdateUserPictureDto,
} from 'src/Dto/user.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersService } from 'src/services/users/users.service';

@Controller('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<{ message: string }> {
    const user = (await this.usersService.create(body)) as {
      id: string;
      email: string;
    };
    const tokens = await this.authService.register(user.id, user.email);
    return { message: `user ${user.email} created` };
  }

  @Patch('update/name')
  async updateUserName(
    @Body() body: UpdateUserNameDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateName(body.id, body.updatedName);
    return { message: `user's ${body.email} name updated` };
  }

  @Patch('upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserPictureDto,
  ) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) throw new BadRequestException('Image file is required');

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
    }

    if (file) {
      await this.usersService.updateImage(body.id, file);
      return { message: `user's ${body.email} image updated` };
    }
  }
}
