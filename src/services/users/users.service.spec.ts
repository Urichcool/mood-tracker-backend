import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ImageService } from '../images/image.service';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateUserNameDto } from 'src/Dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockSave = jest.fn();
  const mockUserModel = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  const mockImageService = {
    uploadToCloudinary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const user = {
        name: 'John',
        email: 'john@example.com',
        imageUrl: '',
        moodEntries: [],
        password: 'secret',
      };
      const savedUser = { _id: 'someid', ...user };
      mockSave.mockResolvedValue(savedUser);

      const result = await service.create(user);

      expect(mockUserModel).toHaveBeenCalledWith(user);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });
  });

  describe('updateName', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const id = 'user123';
      const updatedName = 'New Name';
      const mockUpdatedUser: UpdateUserNameDto = {
        id: id,
        updatedName: updatedName,
        email: 'example123@mail.com',
      };

      (mockUserModel as any).findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedUser);

      const result = await service.updateName(id, updatedName);

      expect((mockUserModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { name: updatedName },
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('updateImage', () => {
    it('should upload image and update user with imageUrl', async () => {
      const id = 'user456';
      const mockFile = {
        buffer: Buffer.from('img-data'),
      } as Express.Multer.File;
      const mockUploadResult = { secure_url: 'http://image.url/image.png' };
      const mockUpdatedUser = {
        _id: id,
        imageUrl: mockUploadResult.secure_url,
      };

      mockImageService.uploadToCloudinary.mockResolvedValue(mockUploadResult);

      (mockUserModel as any).findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedUser);

      const result = await service.updateImage(id, mockFile);

      expect(mockImageService.uploadToCloudinary).toHaveBeenCalledWith(
        mockFile,
      );
      expect((mockUserModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        {
          imageUrl: mockUploadResult.secure_url,
        },
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should not call update if image upload fails', async () => {
      const id = 'user456';
      const mockFile = {
        buffer: Buffer.from('img-data'),
      } as Express.Multer.File;

      mockImageService.uploadToCloudinary.mockResolvedValue(undefined);

      (mockUserModel as any).findByIdAndUpdate = jest.fn();

      const result = await service.updateImage(id, mockFile);

      expect(mockImageService.uploadToCloudinary).toHaveBeenCalledWith(
        mockFile,
      );
      expect((mockUserModel as any).findByIdAndUpdate).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
