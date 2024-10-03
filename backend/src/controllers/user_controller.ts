import { Request, Response } from "express";
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

  studentRegister = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    // Use stuff from Request parameters to call methods on this.userService and res.json it.
    res.json({ id: 1 });
    return;
  });

  staffRegister = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ id: 1 });
    return;
  });

  userLogin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ id: 1 });
    return;
  });

  userType = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ type: 'student' });
    return;
  });

  studentDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name' });
    return;
  });
  
  staffDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name' });
    return;
  });

}