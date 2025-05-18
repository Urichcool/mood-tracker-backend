import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/Dto/create-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<void> {
    await this.usersService.create(body);
  }
  @Patch()
  updateUserData(user: IUser) {
    return `This action updates user data ${user.name}`;
  }
}
