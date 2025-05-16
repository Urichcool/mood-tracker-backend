import { Controller, Patch, Post } from '@nestjs/common';
import { IUser } from 'src/interfaces/user.interface';

@Controller('users-controller')
export class UsersControllerController {
  @Post()
  createUser(user: IUser): string {
    return `This action creates new user ${user.name}`;
  }
  @Patch()
  updateUserData(user: IUser) {
    return `This action updates user data ${user.name}`;
  }
}
