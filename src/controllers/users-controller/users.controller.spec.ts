import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/services/users/users.service';
import { AuthService } from 'src/services/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    create: jest.fn(),
    updateName: jest.fn(),
    updateImage: jest.fn(),
  };

  const mockAuthService = {
    register: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('development'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findUserByEmail.mockResolvedValue({ id: '1' });

      await expect(
        controller.register(
          {
            email: 'test@example.com',
            password: 'pass123',
            name: 'test',
            imageUrl: '',
            moodEntries: [],
          },
          {} as Response,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new user and return tokens', async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
      });
      mockAuthService.register.mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.register(
        {
          email: 'test@example.com',
          password: 'pass123',
          name: 'test',
          imageUrl: '',
          moodEntries: [],
        },
        mockRes,
      );

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockAuthService.register).toHaveBeenCalledWith(
        '1',
        'test@example.com',
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'user test@example.com created',
        accessToken: 'access',
      });
    });
  });

  describe('updateUserName', () => {
    it(`should update the user's name and return a success message`, async () => {
      const body = {
        id: '1',
        email: 'user@example.com',
        updatedName: 'New Name',
      };

      mockUsersService.updateName.mockResolvedValue(undefined);

      const result = await controller.updateUserName(body);

      expect(mockUsersService.updateName).toHaveBeenCalledWith('1', 'New Name');
      expect(result).toEqual({
        message: `user's user@example.com name updated`,
      });
    });
  });

  describe('uploadImage', () => {
    const validFile = {
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    const body = {
      id: '1',
      email: 'user@example.com',
    };

    it('should throw if no file is uploaded', async () => {
      await expect(
        controller.uploadImage(
          undefined as unknown as Express.Multer.File,
          body,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if file is too large', async () => {
      const largeFile = { ...validFile, size: 6 * 1024 * 1024 };
      await expect(controller.uploadImage(largeFile, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if file type is invalid', async () => {
      const invalidFile = { ...validFile, mimetype: 'application/pdf' };
      await expect(controller.uploadImage(invalidFile, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update image successfully', async () => {
      mockUsersService.updateImage.mockResolvedValue(undefined);

      const result = await controller.uploadImage(validFile, body);

      expect(mockUsersService.updateImage).toHaveBeenCalledWith('1', validFile);
      expect(result).toEqual({
        message: `user's user@example.com image updated`,
      });
    });
  });
});
