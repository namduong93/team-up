import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { StaffJSON } from "../models/user/staff/staff_json.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student } from "../models/user/student/student.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { UserRepository } from "../repository/user_repository_type.js";

export type UserTypeObject = { type: string };

export type SessionIdObject = { sessionId: string };

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  studentRegister = async (student: Student): Promise<SessionIdObject | undefined> => {
    // use the user passed in to do some stuff and call the 
    // userRepository methods to interact with the db on behalf of the user.
    let sessionObject = await this.userRepository.studentRegister(student);
    return sessionObject;
  }

  staffRegister = async (staff: StaffJSON): Promise<SessionIdObject | undefined> => {

    // return the sessionId of the staff who registered
    return { sessionId: '0' };
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