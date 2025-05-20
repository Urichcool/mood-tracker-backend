import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/providers/cloudinary-providers';
import { AuthModule } from './auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [CloudinaryProvider],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
