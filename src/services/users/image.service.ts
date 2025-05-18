import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/providers/cloudinary-providers';
import { Readable } from 'stream';

@Injectable()
export class ImageService {
  async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mood-tracker/profiles',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
