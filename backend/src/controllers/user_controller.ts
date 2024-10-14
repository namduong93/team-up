import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";
import { Student } from "../models/user/student/student.js";
import { Staff } from "../models/user/staff/staff.js";
import { defaultCookieOptions } from "./controller_util/cookie_options.js";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  studentRegister = httpErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Use stuff from Request parameters to call methods on this.userService and res.json it.
    const new_student: Student = {
      name: req.body.name,
      preferredName: req.body.preferredName,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      pronouns: req.body.pronouns,
      tshirtSize: req.body.tshirtSize,
      allergies: req.body.allergies,
      dietaryReqs: req.body.dietaryReqs,
      accessibilityReqs: req.body.accessibilityReqs,
      universityId: req.body.universityId,
      studentId: req.body.studentId,
    };

    const sessionIdObject = await this.userService.studentRegister(new_student);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);

    res.json({});
    return;
  });

  staffRegister = httpErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const new_staff: Staff = {
      name: req.body.name,
      preferredName: req.body.preferredName,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      pronouns: req.body.pronouns,
      tshirtSize: req.body.tshirtSize,
      allergies: req.body.allergies,
      dietaryReqs: req.body.dietaryReqs,
      accessibilityReqs: req.body.accessibilityReqs,
      universityId: req.body.universityId,
    };

    const sessionIdObject = await this.userService.staffRegister(new_staff);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);
    
    res.json({});
    return;
  });

  userLogin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;

    const sessionIdObject = await this.userService.userLogin(email, password);
    res.cookie('sessionId', sessionIdObject.sessionId, defaultCookieOptions);
    res.json({});

    return;
  });

  userLogout = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const sessionId = req.cookies.sessionId;
    await this.userService.userLogout(sessionId);
    res.clearCookie('sessionId');
    res.json({});
    return;
  });

  userProfileInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userProfileInfo = await this.userService.userProfileInfo(Number(userId));
    res.json(userProfileInfo);
    return;
  });

  userType = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const userTypeObject = await this.userService.userType(Number(userId));
    res.json(userTypeObject);
    return;
  });

  studentDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name', affiliation: 'UNSW' });
    return;
  });
  
  staffDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name', affiliation: 'UNSW' });
    return;
  });

  systemAdminDashInfo = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ preferredName: 'Name', affiliation: 'ICPC' });
    return;
  });

}