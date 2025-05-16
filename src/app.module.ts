import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersControllerController } from './controllers/users-controller/users-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersControllerController],
  providers: [AppService],
})
export class AppModule {}
