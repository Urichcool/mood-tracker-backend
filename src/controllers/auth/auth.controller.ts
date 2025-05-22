import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from 'src/Dto/signIn.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: SignInDto): Promise<{ message: string }> {
    await this.authService.signIn(body.email, body.password);
    return { message: `user ${body.email} has been signed in` };
  }
}
