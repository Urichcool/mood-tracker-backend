import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users-controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';

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
  providers: [],
})
export class AppModule {}
