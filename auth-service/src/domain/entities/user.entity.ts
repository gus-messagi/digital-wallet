import { Exclude } from 'class-transformer';
import { Err, Ok, Result } from 'ts-results';
import * as bcrypt from 'bcrypt';

export class UserEntity {
  id?: string;
  email: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: UserEntity) {
    Object.assign(this, props);
  }

  static create(
    user: Partial<UserEntity> & { confirmPassword: string },
    salt: number,
  ): Result<UserEntity, string> {
    if (user.password !== user.confirmPassword) {
      return new Err(`Password's doens't match`);
    }

    const entity = new UserEntity({
      email: user.email,
      password: bcrypt.hashSync(user.password, salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Ok(entity);
  }
}
