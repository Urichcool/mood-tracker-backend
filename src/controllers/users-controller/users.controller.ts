import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto, UpdateUserDto } from 'src/Dto/user.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<{ message: string }> {
    await this.usersService.create(body);
    return { message: `user ${body.email} created` };
  }

  @Patch()
  async updateUserName(
    @Body() body: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateName(body.id, body.updatedName);
    return { message: `user's ${body.email} name updated` };
  }

  @Patch('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    console.log(process.env.CLOUDINARY_API_KEY);
    await this.usersService.updateImage(body.id, file);
    return { message: `user's ${body.email} image updated` };
  }
}
