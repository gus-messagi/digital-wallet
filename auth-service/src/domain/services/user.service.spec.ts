import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserImplRepository } from 'src/infrastructure/data/repositories/user-impl.repository';
import { UserEntity } from '../entities/user.entity';

describe('UserService', () => {
  let userService: UserService;

  const mockUsers = [
    {
      id: '123-abc',
      email: 'user@email.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserImplRepository,
          useValue: {
            findById: jest.fn((id) => {
              const user = mockUsers.find((user) => user.id === id);

              if (!user) {
                return null;
              }

              return new UserEntity(user);
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getById', () => {
    it('should get user by id', async () => {
      const userId = '123-abc';

      const response = await userService.getById(userId);
      const user = response.unwrap();

      expect(response.ok).toBe(true);
      expect(user.id).toBe('123-abc');
      expect(user.email).toBe('user@email.com');
    });

    it('should get user by id', async () => {
      const userId = 'not_found_id';

      const response = await userService.getById(userId);

      expect(response.err).toBe(true);
      expect(response.val).toBe('User not found');
    });
  });
});
