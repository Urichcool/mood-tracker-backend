import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  CreateUserDto,
  UpdateUserNameDto,
  UpdateUserPictureDto,
} from 'src/Dto/user.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersService } from 'src/services/users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private hashPasword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; accessToken: string }> {
    const isUserExist = await this.usersService.findUserByEmail(body.email);
    if (isUserExist) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword: string = await this.hashPasword(body.password);
    const user = (await this.usersService.create({
      ...body,
      password: hashedPassword,
    })) as {
      id: string;
      email: string;
    };
    const tokens = await this.authService.register(user.id, user.email);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      message: `user ${user.email} created`,
      accessToken: tokens.accessToken,
    };
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
