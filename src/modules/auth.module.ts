import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth/auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
