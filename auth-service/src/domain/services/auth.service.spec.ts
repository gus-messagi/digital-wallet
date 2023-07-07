import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserImplRepository } from 'src/infrastructure/data/repositories/user-impl.repository';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hashSync: (password: string) => password,
  compareSync: (passwordRequest: string, userPassword: string) =>
    passwordRequest === userPassword,
}));

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsers = [
    {
      id: '123-abc',
      email: 'user@email.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockHours = 3600 * 1000 * 8;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'TOKEN'),
            decode: jest.fn(() => ({
              id: '123-abc',
              iat: Date.now(),
              exp: (Date.now() + mockHours) / 1000,
            })),
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
              const user = mockUsers.find((user) => user.email === email);

              if (!user) {
                return null;
              }

              return new UserEntity(user);
            }),
            findById: jest.fn((id) => {
              const user = mockUsers.find((user) => user.id === id);

              if (!user) {
                return null;
              }

              return new UserEntity(user);
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

  describe('signIn', () => {
    it('should authenticate an user', async () => {
      const user = {
        email: 'user@email.com',
        password: '123456',
      };

      const response = await authService.signIn(user);

      expect(response.ok).toBe(true);
      expect(response.val).toBe('TOKEN');
    });

    it('should return err because of wrong email', async () => {
      const user = {
        email: 'wrong@email.com',
        password: '123456',
      };

      const response = await authService.signIn(user);

      expect(response.ok).toBe(false);
      expect(response.val).toBe('Invalid credentials');
    });

    it('should return err because of wrong password', async () => {
      const user = {
        email: 'user@email.com',
        password: '1234567',
      };

      const response = await authService.signIn(user);

      expect(response.ok).toBe(false);
      expect(response.val).toBe('Invalid credentials');
    });
  });

  describe('validation', () => {
    it('should validate succesfully user', async () => {
      const token = 'USER_TOKEN';
      const response = await authService.validation(token);

      expect(response.ok).toBe(true);
      expect(response.val).toBe('123-abc');
    });

    it('should unauthorize user because expired token', async () => {
      const token = 'USER_TOKEN';

      jest.spyOn(authService['jwt'], 'decode').mockReturnValue({
        id: '123-abc',
        iat: Date.now(),
        exp: (Date.now() - mockHours) / 1000,
      });

      const response = await authService.validation(token);

      expect(response.ok).toBe(false);
      expect(response.val).toBe('Token expired');
    });

    it('should unauthorize user because was not found userId', async () => {
      const token = 'USER_TOKEN';

      jest.spyOn(authService['repository'], 'findById').mockReturnValue(null);

      const response = await authService.validation(token);

      expect(response.ok).toBe(false);
      expect(response.val).toBe(`User doesn't exist`);
    });
  });
});
