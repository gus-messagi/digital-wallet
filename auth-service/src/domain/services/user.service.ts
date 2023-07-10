import { Inject, Injectable } from '@nestjs/common';
import { UserImplRepository } from 'src/infrastructure/data/repositories/user-impl.repository';
import { UserRepository } from '../repositories/user.repository';
import { Err, Ok, Result } from 'ts-results';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  @Inject(UserImplRepository)
  private readonly repository: UserRepository;

  async getById(userId: string): Promise<Result<UserEntity, string>> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return Err('User not found');
    }

    return Ok(user);
  }
}
