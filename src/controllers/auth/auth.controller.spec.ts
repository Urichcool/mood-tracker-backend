import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, CustomRequest } from './auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from 'src/Dto/signIn.dto';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/guards/auth/auth.guard';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockRefreshTokenGuard = {
    canActivate: jest.fn(() => true),
  };

  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(RefreshTokenGuard)
      .useValue(mockRefreshTokenGuard)
      .compile();

    app = module.createNestApplication();
    await app.init();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user and set refresh token cookie', async () => {
      const dto: SignInDto = { email: 'test@example.com', password: 'pass123' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const res = {
        cookie: jest.fn().mockImplementation(() => res),
      } as Partial<Response> as Response;

      mockAuthService.signIn.mockResolvedValue({ accessToken, refreshToken });
      mockConfigService.get.mockReturnValue('development');

      const result = await authController.login(dto, res);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: expect.any(Number) as number,
          secure: false,
          sameSite: 'strict',
        }),
      );
      expect(result).toEqual({
        message: `User ${dto.email} has been logged in`,
        accessToken,
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and set new refresh token cookie', async () => {
      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';
      const req = {
        cookies: {
          refreshToken: 'old-refresh-token',
        },
      } as Partial<CustomRequest> as CustomRequest;

      const res = {
        cookie: jest.fn().mockImplementation(() => res),
      } as Partial<Response> as Response;

      mockAuthService.refreshToken.mockResolvedValue({
        accessToken,
        refreshToken,
      });
      mockConfigService.get.mockReturnValue('production');

      const result = await authController.refresh(req, res);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'old-refresh-token',
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: expect.any(Number) as number,
          secure: true,
          sameSite: 'strict',
        }),
      );
      expect(result).toEqual({
        message: 'Tokens refreshed',
        accessToken,
      });
    });
  });
});
