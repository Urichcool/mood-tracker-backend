import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from 'src/guards/auth/auth.guard';

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: configService.get<string>('JWT_REFRESH_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, RefreshTokenGuard],
  controllers: [AuthController],
  exports: [AuthService, RefreshTokenGuard, JwtModule],
})
export class AuthModule {}
