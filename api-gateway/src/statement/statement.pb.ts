/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "statement";

export interface GenerateStatementRequest {
  userId: string;
  maxDate: string;
}

export interface GenerateStatementResponse {
  status: number;
  error: string[];
  items: StatementItem[];
}

export interface StatementItem {
  amount: string;
  balance: string;
  operation: string;
  date: string;
}

export const STATEMENT_PACKAGE_NAME = "statement";

export interface StatementServiceClient {
  generateStatement(request: GenerateStatementRequest): Observable<GenerateStatementResponse>;
}

export interface StatementServiceController {
  generateStatement(
    request: GenerateStatementRequest,
  ): Promise<GenerateStatementResponse> | Observable<GenerateStatementResponse> | GenerateStatementResponse;
}

export function StatementServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["generateStatement"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StatementService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StatementService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STATEMENT_SERVICE_NAME = "StatementService";
