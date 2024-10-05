import { Request, Response } from "express";
import { UserService } from "../services/user_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";
import { Student } from "../models/user/student/student.js";


export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  studentRegister = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    // Use stuff from Request parameters to call methods on this.userService and res.json it.
    const { name, password, email, tshirtSize, pronouns, allergies, accessibilityReqs, universityId, studentId } = req.body;
    const new_student = new Student(
      name,
      password, 
      email,
      tshirtSize,
      pronouns,
      allergies,
      accessibilityReqs,
      studentId
  );
    const sessionIdObject = await this.userService.studentRegister(new_student);
    res.json(sessionIdObject);
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