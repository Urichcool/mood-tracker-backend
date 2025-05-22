import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
