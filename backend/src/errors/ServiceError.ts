import { ErrorInterface } from "./ErrorInterface";

export enum ServiceErrorType {
  Auth = 'Auth',
  NotFound = 'NotFound',
}

/**
 * Represents an error that occurred during a service operation.
 */
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