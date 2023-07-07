import { Inject } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaConnector } from '../prisma';

export class UserImplRepository implements UserRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(user: UserEntity): Promise<UserEntity> {
    const userCreated = await this.db.user.create({
      data: user,
    });

    return new UserEntity(userCreated);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.db.user.findFirst({ where: { email } });

    if (!user) return null;

    return new UserEntity(user);
  }
}
