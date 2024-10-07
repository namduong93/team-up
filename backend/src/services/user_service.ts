import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { UserRepository } from "../repository/user_repository_type.js";
import { SessionRepository, SessionTokenObject } from "../repository/session_repository_type.js";
import { Session } from "../models/session/session.js";
import { v4 as uuidv4 } from 'uuid';
import { UserProfileInfo } from "../models/user/user_profile_info.js";
import createHttpError from "http-errors";
import { Student, validateStudent } from "../models/user/student/student.js";
import { Staff, validateStaff } from "../models/user/staff/staff.js";

export type UserTypeObject = { type: string };

export class UserService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  studentRegister = async (student: Student): Promise<SessionTokenObject | undefined> => {
    const validated = validateStudent(student);
    if (validated) {
        throw createHttpError(validated);
    }

    const userIdObject = await this.userRepository.studentRegister(student);
    let session : Session = { 
      sessionId: uuidv4(), 
      userId: userIdObject.userId, 
      createdAt: Math.floor(Date.now() / 1000) 
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  staffRegister = async (staff: Staff): Promise<SessionTokenObject | undefined> => {
    const validated = validateStaff(staff);
    if (validated) {
        throw createHttpError(validated);
    }

    let userId = await this.userRepository.staffRegister(staff);
    let session : Session = { 
      sessionId: uuidv4(), 
      userId: userId.userId, 
      createdAt: Math.floor(Date.now() / 1000) 
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  userLogin = async (email: string, password: string): Promise<SessionTokenObject | undefined> => {
    if(!email || email.length === 0) {
      throw createHttpError(400, 'Email is required');
    }
    if(!password || password.length === 0) {
      throw createHttpError(400, 'Password is required');
    }

    const userIdObject = await this.userRepository.userLogin(email, password);
    if (!userIdObject) {
      throw createHttpError(401, 'Invalid email or password');
    }

    let session : Session = { 
     sessionId: uuidv4(), 
     userId: userIdObject.userId, 
     createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  userLogout = async (sessionToken: string): Promise<void> => {
    await this.sessionRepository.delete(sessionToken);
    return ;
  }

  userProfileInfo = async (userId: number): Promise<UserProfileInfo | undefined> => {
    const userProfileInfo = await this.userRepository.userProfileInfo(userId);
    
    if (!userProfileInfo) {
      throw createHttpError(400, 'User not found');
    }

    return userProfileInfo;
  }

  userType = async (sessionToken: string): Promise<UserTypeObject | undefined> => {
    
    return { type: 'student' };
  }

  studentDashInfo = async (sessionToken: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionToken: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  systemAdminDashInfo = async (sessionToken: string): Promise<SystemAdminDashInfo | undefined> => {

    return { preferredName: 'Name' };
  }

  
}