import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from 'src/domain/services/user.service';
import {
  AUTH_SERVICE_NAME,
  GetUserByIdResponse,
} from 'src/infrastructure/protos/auth.pb';
import { GetUserByIdRequestDTO } from '../dtos/user.dto';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @GrpcMethod(AUTH_SERVICE_NAME, 'GetUserById')
  async getUserById(
    payload: GetUserByIdRequestDTO,
  ): Promise<GetUserByIdResponse> {
    const response = await this.service.getById(payload.id);

    if (response.err) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [response.val],
        user: null,
      };
    }

    const user = response.unwrap();
    const mapToView = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      ...(user.deletedAt && { deleteAt: user.deletedAt.toISOString() }),
    };

    return {
      status: HttpStatus.OK,
      user: mapToView,
      error: null,
    };
  }
}
