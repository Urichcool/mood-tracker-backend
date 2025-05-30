import { RefreshTokenGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test_refresh_secret'),
  };

  beforeEach(() => {
    jwtService = mockJwtService as unknown as JwtService;
    configService = mockConfigService as unknown as ConfigService;
    guard = new RefreshTokenGuard(jwtService, configService);
  });

  const createMockContext = (cookies: Record<string, string> = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () =>
          ({
            cookies,
          }) as any,
      }),
    }) as unknown as ExecutionContext;

  it('should allow access if token is valid', async () => {
    const mockPayload = { sub: '123', username: 'test' };
    mockJwtService.verifyAsync = jest.fn().mockResolvedValue(mockPayload);

    const context = createMockContext({ refreshToken: 'valid_token' });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid_token', {
      secret: 'test_refresh_secret',
    });
  });

  it('should throw UnauthorizedException if no token is present', async () => {
    const context = createMockContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    mockJwtService.verifyAsync = jest
      .fn()
      .mockRejectedValue(new Error('invalid token'));

    const context = createMockContext({ refreshToken: 'invalid_token' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
