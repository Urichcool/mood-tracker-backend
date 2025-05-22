import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SignInDto } from 'src/Dto/signIn.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  checkSecure() {
    const configService = new ConfigService();
    return configService.get<string>('NODE_ENV') === 'production';
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.signIn(body.email, body.password);
    res.cookie('token', jwt, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.checkSecure(),
      maxAge: 3600000,
    });
    return { message: 'Logged in' };
  }
}
