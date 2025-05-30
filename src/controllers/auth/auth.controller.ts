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
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

export interface CustomRequest extends Request {
  cookies: Record<string, string>;
}
@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User has been logged in.',
    example: {
      message: `User john@example.com has been logged in`,
      accessToken: 'example-token',
    },
  })
  @Post('login')
  async login(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; accessToken: string }> {
    const {
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    } = await this.authService.signIn(body.email, body.password);

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
  @ApiResponse({ status: 200, description: 'Tokens has been refreshed.' })
  @Post('refresh')
  async refresh(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; accessToken: string }> {
    const oldToken: string = req.cookies?.refreshToken;

    const {
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    } = await this.authService.refreshToken(oldToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });

    return { message: 'Tokens refreshed', accessToken: accessToken };
  }
}
