import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findUser(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user?.password !== pass) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user._id, username: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload: { sub: string; username: string } = this.jwtService.verify(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
