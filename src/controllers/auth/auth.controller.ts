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
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      body.email,
      body.password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    return {
      message: `User ${body.email} has been logged in`,
      accessToken: accessToken,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldToken = req.cookies?.refreshToken;

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(oldToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });

    return { message: 'Tokens refreshed', accessToken: accessToken };
  }
}
