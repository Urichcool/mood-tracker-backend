import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/providers/cloudinary-providers';
import { ImageService } from 'src/services/images/image.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, ImageService],
  exports: ['CLOUDINARY', ImageService],
})
export class CloudinaryModule {}
