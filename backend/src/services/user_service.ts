import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { Student } from "../models/user/student/student.js";
import { UserRepository } from "../repository/user_repository_type.js";
import { Staff } from "../models/user/staff/staff.js";
import { SessionRepository } from "../repository/session_repository_type.js";

export type UserTypeObject = { type: string };

export type SessionIdObject = { sessionId: string };

export class UserService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  studentRegister = async (student: Student): Promise<SessionIdObject | undefined> => {
    // use the user passed in to do some stuff and call the 
    // userRepository methods to interact with the db on behalf of the user.
    let sessionIdObject = await this.userRepository.studentRegister(student);
    return sessionIdObject;
  }

  staffRegister = async (staff: Staff): Promise<SessionIdObject | undefined> => {
    let sessionIdObject = await this.userRepository.staffRegister(staff);
    return sessionIdObject;
  }

  userLogin = async (email: string, password: string): Promise<SessionIdObject | undefined> => {

    // return the sessionId of whoever logged in
    return { sessionId: '0' };
  }

  userType = async (sessionId: string): Promise<UserTypeObject | undefined> => {
    
    return { type: 'student' };
  }

  studentDashInfo = async (sessionId: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionId: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  systemAdminDashInfo = async (sessionId: string): Promise<SystemAdminDashInfo | undefined> => {

    return { preferredName: 'Name' };
  }

  
}