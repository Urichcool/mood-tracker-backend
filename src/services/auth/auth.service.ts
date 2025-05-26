import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(id: string, email: string) {
    const tokens = await this.generateTokens(id, email);
    await this.usersService.setRefreshToken(
      id,
      await this.hashToken(tokens.refreshToken),
    );
    return tokens;
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = (await this.usersService.findUserByEmail(email)) as {
      id: string;
      email: string;
      password: string;
    };
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (isMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const tokens = (await this.generateTokens(user.id, user.email)) as {
      accessToken: string;
      refreshToken: string;
    };
    await this.usersService.setRefreshToken(
      user.id,
      await this.hashToken(tokens.refreshToken),
    );

    return tokens;
  }

  async hashToken(token: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(token, salt);
  }

  async generateTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(
    oldToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(oldToken, refreshToken);
  }

  async refreshToken(oldToken: string) {
    try {
      const payload: { sub: string; username: string } = this.jwtService.verify(
        oldToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = (await this.usersService.findUserById(payload.sub)) as {
        refreshToken: string;
        id: string;
      };

      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access denied');

      const isMatch = await this.verifyRefreshToken(
        oldToken,
        user.refreshToken,
      );
      if (!isMatch) throw new ForbiddenException('Token mismatch');

      const newTokens = await this.generateTokens(
        payload.sub,
        payload.username,
      );

      await this.usersService.setRefreshToken(
        user.id,
        await this.hashToken(newTokens.refreshToken),
      );

      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
