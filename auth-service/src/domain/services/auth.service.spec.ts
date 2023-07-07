import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserImplRepository } from 'src/infrastructure/data/repositories/user-impl.repository';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'TOKEN'),
          },
        },
        {
          provide: UserImplRepository,
          useValue: {
            create: jest.fn((user) => ({
              id: crypto.randomUUID(),
              email: user.email,
              password: user.password,
            })),
            findByEmail: jest.fn((email) => {
              const users = [
                {
                  id: crypto.randomUUID(),
                  email: 'user@email.com',
                  password: '123456',
                },
              ];

              return users.find((user) => user.email === email);
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 10),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should create an user', async () => {
      const user = {
        email: 'test@email.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const response = await authService.signUp(user);

      expect(response.ok).toBe(true);
      expect(response.val).toBe('TOKEN');
    });

    it('should return error because user already exists', async () => {
      const user = {
        email: 'user@email.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const response = await authService.signUp(user);

      expect(response.ok).toBe(false);
      expect(response.val).toBe('User already exists');
    });

    it(`should return error because password's doesn't match`, async () => {
      const user = {
        email: 'test@email.com',
        password: '123456',
        confirmPassword: '1234567',
      };

      const response = await authService.signUp(user);

      expect(response.ok).toBe(false);
      expect(response.val).toBe(`Password's doesn't match`);
    });
  });
});
