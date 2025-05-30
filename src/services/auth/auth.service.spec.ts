import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let configService: Partial<Record<keyof ConfigService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      setRefreshToken: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) =>
        key === 'JWT_ACCESS_SECRET'
          ? 'access-secret'
          : key === 'JWT_REFRESH_SECRET'
            ? 'refresh-secret'
            : null,
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return tokens if credentials are correct', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      usersService.findUserByEmail!.mockResolvedValue(user);
      jwtService.signAsync!.mockResolvedValueOnce('access-token');
      jwtService.signAsync!.mockResolvedValueOnce('refresh-token');
      usersService.setRefreshToken!.mockResolvedValue(undefined);

      const tokens = await authService.signIn(user.email, 'password123');

      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      expect(usersService.setRefreshToken).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      usersService.findUserByEmail!.mockResolvedValue(null);

      await expect(
        authService.signIn('notfound@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is incorrect', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('correct-pass', 10),
      };

      usersService.findUserByEmail!.mockResolvedValue(user);

      await expect(
        authService.signIn(user.email, 'wrong-pass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should generate and store hashed refresh token', async () => {
      jwtService.signAsync!.mockResolvedValueOnce('access-token');
      jwtService.signAsync!.mockResolvedValueOnce('refresh-token');
      usersService.setRefreshToken!.mockResolvedValue(undefined);

      const result = await authService.register('123', 'user@example.com');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      expect(usersService.setRefreshToken).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens if refresh token is valid', async () => {
      const oldToken = 'old-refresh-token';
      const user = {
        id: '123',
        refreshToken: await bcrypt.hash(oldToken, 10),
      };

      jwtService.verify!.mockReturnValue({
        sub: '123',
        username: 'test@example.com',
      });
      usersService.findUserById!.mockResolvedValue(user);
      jwtService.signAsync!.mockResolvedValueOnce('new-access-token');
      jwtService.signAsync!.mockResolvedValueOnce('new-refresh-token');
      usersService.setRefreshToken!.mockResolvedValue(undefined);

      const tokens = await authService.refreshToken(oldToken);

      expect(tokens).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(usersService.setRefreshToken).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      jwtService.verify!.mockReturnValue({
        sub: '123',
        username: 'test@example.com',
      });
      usersService.findUserById!.mockResolvedValue(null);

      await expect(authService.refreshToken('invalid')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw if refresh token mismatch', async () => {
      const user = {
        id: '123',
        refreshToken: await bcrypt.hash('some-other-token', 10),
      };

      jwtService.verify!.mockReturnValue({
        sub: '123',
        username: 'test@example.com',
      });
      usersService.findUserById!.mockResolvedValue(user);

      await expect(
        authService.refreshToken('mismatched-token'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw UnauthorizedException if JWT is invalid', async () => {
      jwtService.verify!.mockImplementation(() => {
        throw new Error('Invalid');
      });

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
