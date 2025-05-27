import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { cookies: Record<string, string> }>();

    const token = req.cookies?.refreshToken as string;
    if (!token) {
      throw new UnauthorizedException('token required');
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      req['user'] = payload;
    } catch {
      throw new UnauthorizedException('invalid token');
    }
    return true;
  }
}
