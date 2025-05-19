import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class ImageService {
  constructor(
    @Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary,
  ) {}
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
