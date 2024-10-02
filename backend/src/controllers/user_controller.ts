import { Request, Response } from "express";
import { User } from "../models/user/user.js";
import { UserService } from "../services/user_service.js";
import createHttpError from "http-errors";


type HTTPFunction = (req: Request, res: Response) => Promise<void>;
function httpErrorHandler(httpFunction: HTTPFunction) {
  return async function(req: Request, res: Response) {
    // Call given function and pass on any error status code/messages
    try {
      await httpFunction(req, res);
    } catch (err: unknown) {
      // dev: 
      console.log(err);
      
      if (createHttpError.isHttpError(err)) {
        // err is auto cast to a HttpError here.
        res.status(err.statusCode).json(err);
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };
}

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  addStudent = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    // Use stuff from Request parameters to call methods on this.userService and res.json it.
    return;
  });
}