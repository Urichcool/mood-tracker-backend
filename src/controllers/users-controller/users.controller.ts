import { Controller, Patch, Post } from '@nestjs/common';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async createUser(user: IUser): Promise<string> {
    await this.usersService.create(user);
    return user.name;
  }
  @Patch()
  updateUserData(user: IUser) {
    return `This action updates user data ${user.name}`;
  }
}
