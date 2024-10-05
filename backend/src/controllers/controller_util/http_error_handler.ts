import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";


export type HTTPFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export function httpErrorHandler(httpFunction: HTTPFunction) {
  return async function(req: Request, res: Response, next: NextFunction) {
    // Call given function and pass on any error status code/messages
    try {
      await httpFunction(req, res, next);
    } catch (err: unknown) {
      // dev: 
      console.log(err);
      
      if (createHttpError.isHttpError(err)) {
        // err is auto cast to a HttpError here.
        res.status(err.statusCode).json(err);
      } else {
        next(err);
      }
    }
  };
}

export class AppError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const TOKEN_NOT_FOUND = new AppError("Token not found");
export const INVALID_TOKEN = new AppError("Invalid token");
export const EXPIRED_TOKEN = new AppError("Expired token");

export const BAD_REQUEST = new AppError("Bad request");

export const USER_NOT_FOUND = new AppError("User is not existed");