import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from 'src/Dto/signIn.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from 'src/guards/auth/auth.guard';

export interface CustomRequest extends Request {
  cookies: Record<string, string>;
}

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
    const tokens = await this.authService.signIn(body.email, body.password);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: this.checkSecure(),
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: this.checkSecure(),
      sameSite: 'strict',
    });
    return { message: `User ${body.email} has been logged in` };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldToken = req.cookies?.refreshToken;

    const { accessToken, refreshToken } =
      this.authService.refreshToken(oldToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
      secure: this.checkSecure(),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: this.checkSecure(),
    });

    return { message: 'Tokens refreshed' };
  }
}
