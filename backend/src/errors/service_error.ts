import { ErrorInterface } from "./error_interface";

export enum ServiceErrorType {
  Auth = 'Auth',
  NotFound = 'NotFound',
}

export class ServiceError extends Error implements ErrorInterface {
  
  private errorType: ServiceErrorType | string;

  constructor(errorType: ServiceErrorType | string, message: string) {
    super(message);
    this.errorType = errorType;
    this.name = 'DbError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
  
  public static Auth = ServiceErrorType.Auth;
  public static NotFound = ServiceErrorType.NotFound;

  public getErrorType() {
    return this.errorType;
  }
}