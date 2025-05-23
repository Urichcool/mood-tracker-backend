import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from 'src/Dto/signIn.dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  username: string;
}

@Controller('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

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
      secure: true,
      sameSite: 'strict',
      path: '/auth/login',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    return { message: `User ${body.email} has been logged in` };
  }

  @Post('refresh')
  refresh(@Req() request: Request) {
    try {
      const payload: JwtPayload = this.jwtService.verify(body.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
