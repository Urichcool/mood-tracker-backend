import { Body, Controller, Patch, Post } from '@nestjs/common';
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
    await this.usersService.update(body.id, body.updatedName);
    return { message: `user's ${body.email} name updated` };
  }
}
