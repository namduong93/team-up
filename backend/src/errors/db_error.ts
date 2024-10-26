import { ErrorInterface } from "./error_interface";

enum DbErrorType {
  Auth = 'Auth',
  Query = 'Query',
  Insert = 'Insert',
}

export class DbError extends Error implements ErrorInterface {
  
  private errorType: DbErrorType | string;

  constructor(errorType: DbErrorType | string, message: string) {
    super(message);
    this.errorType = errorType;
    this.name = 'DbError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
  
  public static Auth = DbErrorType.Auth;
  public static Query = DbErrorType.Query;
  public static Insert = DbErrorType.Insert;
  

  public getErrorType() {
    return this.errorType;
  }
}