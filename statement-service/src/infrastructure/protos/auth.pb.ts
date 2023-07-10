/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  status: number;
  error: string[];
  token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpResponse {
  status: number;
  error: string[];
  token: string;
}

export interface ValidationRequest {
  token: string;
}

export interface ValidationResponse {
  status: number;
  error: string[];
  userId: string;
}

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserByIdResponse {
  status: number;
  error: string[];
  user: User | undefined;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | undefined;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  signUp(request: SignUpRequest): Observable<SignUpResponse>;

  signIn(request: SignInRequest): Observable<SignInResponse>;

  validation(request: ValidationRequest): Observable<ValidationResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;
}

export interface AuthServiceController {
  signUp(request: SignUpRequest): Promise<SignUpResponse> | Observable<SignUpResponse> | SignUpResponse;

  signIn(request: SignInRequest): Promise<SignInResponse> | Observable<SignInResponse> | SignInResponse;

  validation(
    request: ValidationRequest,
  ): Promise<ValidationResponse> | Observable<ValidationResponse> | ValidationResponse;

  getUserById(
    request: GetUserByIdRequest,
  ): Promise<GetUserByIdResponse> | Observable<GetUserByIdResponse> | GetUserByIdResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["signUp", "signIn", "validation", "getUserById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
