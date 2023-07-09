/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "wallet";

export enum Operation {
  deposit = 0,
  withdraw = 1,
  purchase = 2,
  reversal = 3,
  cancellation = 4,
  UNRECOGNIZED = -1,
}

export interface TransactionRequest {
  userId: string;
  operation: Operation;
  transactionId?: string | undefined;
  amount?: number | undefined;
}

export interface TransactionResponse {
  status: number;
  error: string[];
}

export interface BalanceRequest {
  userId: string;
}

export interface BalanceResponse {
  status: number;
  error: string[];
  balance: number;
}

export const WALLET_PACKAGE_NAME = "wallet";

export interface WalletServiceClient {
  transaction(request: TransactionRequest): Observable<TransactionResponse>;

  balance(request: BalanceRequest): Observable<BalanceResponse>;
}

export interface WalletServiceController {
  transaction(
    request: TransactionRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  balance(request: BalanceRequest): Promise<BalanceResponse> | Observable<BalanceResponse> | BalanceResponse;
}

export function WalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["transaction", "balance"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WALLET_SERVICE_NAME = "WalletService";
