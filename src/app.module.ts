import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users-controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || ''),
    UsersModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [AuthService],
})
export class AppModule {}
