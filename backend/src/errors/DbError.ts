import { ErrorInterface } from "./ErrorInterface";

enum DbErrorType {
  Auth = 'Auth',
  Query = 'Query',
  Insert = 'Insert',
  Update = 'Update',
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
  public static Update = DbErrorType.Update;
  

  public getErrorType() {
    return this.errorType;
  }
}