import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from '../dtos/auth.dto';
import { UserEntity } from '../entities/user.entity';
import { UserImplRepository } from 'src/infrastructure/data/repositories/user-impl.repository';
import { UserRepository } from '../repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { Err, Ok, Result } from 'ts-results';

@Injectable()
export class AuthService {
  @Inject(UserImplRepository)
  private readonly repository: UserRepository;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private readonly jwt: JwtService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  async signUp(
    user: AuthDTO & { confirmPassword: string },
  ): Promise<Result<string, string>> {
    const userFound = await this.repository.findByEmail(user.email);

    if (userFound) {
      return Err('User already exists');
    }

    const saltRounds = this.configService.get<number>('salt');
    const entityResult = UserEntity.create(user, saltRounds);

    if (entityResult.err) {
      return entityResult;
    }

    const userCreated = await this.repository.create(entityResult.unwrap());
    const token = this.jwt.sign({ id: userCreated.id });

    return Ok(token);
  }
}
