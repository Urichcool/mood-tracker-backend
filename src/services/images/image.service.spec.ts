import { ImageService } from './image.service';
import { UploadApiResponse } from 'cloudinary';
import { Writable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

type UploadCallback = (
  error: Error | null | undefined,
  result?: UploadApiResponse,
) => void;

describe('ImageService', () => {
  let service: ImageService;
  let mockUploadStreamFn: jest.Mock;

  beforeEach(() => {
    mockUploadStreamFn = jest.fn();

    const mockCloudinary = {
      uploader: {
        upload_stream: mockUploadStreamFn,
      },
    };

    service = new ImageService(mockCloudinary as unknown as typeof cloudinary);
  });

  it('should resolve with result if upload succeeds', async () => {
    const mockFile = {
      buffer: Buffer.from('test image buffer'),
    } as Express.Multer.File;

    const mockResult = {
      secure_url: 'https://image.com/image.png',
      public_id: 'some_id',
      resource_type: 'image',
    } as UploadApiResponse;

    mockUploadStreamFn.mockImplementation((options, cb: UploadCallback) => {
      const writable = new Writable({
        write(chunk, encoding, callback) {
          cb(null, mockResult);
          callback();
        },
      });
      return writable;
    });

    const result = await service.uploadToCloudinary(mockFile);
    expect(result).toEqual(mockResult);
  });

  it('should reject with error if upload fails', async () => {
    const mockFile = {
      buffer: Buffer.from('fail buffer'),
    } as Express.Multer.File;

    mockUploadStreamFn.mockImplementation((options, cb: UploadCallback) => {
      const writable = new Writable({
        write(chunk, encoding, callback) {
          cb(new Error('Upload failed'), undefined);
          callback();
        },
      });
      return writable;
    });

    await expect(service.uploadToCloudinary(mockFile)).rejects.toThrow(
      'Upload failed',
    );
  });
});
