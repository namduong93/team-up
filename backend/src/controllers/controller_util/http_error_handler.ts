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

export const TOKEN_NOT_FOUND = createHttpError(403, "Token not found");
export const INVALID_TOKEN = createHttpError(403, "Invalid token");
export const EXPIRED_TOKEN = createHttpError(403, "Expired token");
export const BAD_REQUEST = createHttpError(400, "Bad request");
export const USER_NOT_FOUND = createHttpError(400, "User is not existed");

// competition error

export const COMPETITION_NOT_FOUND = createHttpError(400, "Competition not found");
export const COMPETITION_CODE_EXISTED = createHttpError(400, "Competition code existed");

export const COMPETITION_ADMIN_REQUIRED = createHttpError(400, "User is not an admin");
export const COMPETITION_COACH_REQUIRED = createHttpError(400, "User is not a coach");
export const COMPETITION_STUDENT_REQUIRED = createHttpError(400, "User is not a student");

export const COMPETITION_USER_REGISTERED = createHttpError(400, "User already registered in competition");
