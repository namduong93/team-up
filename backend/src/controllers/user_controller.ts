import { Request, Response } from "express";
import { UserService } from "../services/user_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";


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

  systemAdminDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name' });
    return;
  });

}