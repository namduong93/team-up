import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { StaffJSON } from "../models/user/staff/staff_json.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { UserRepository } from "../repository/user_repository_type.js";

export type UserTypeObject = { type: string };
export type CompetitionCodeObject = { code: string };
export type UniversitySiteInput = { universityId: number, defaultSite: string }

type SessionIdObject = { sessionId: string };

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  studentRegister = async (name: string, preferredName: string,
    password: string, email: string, tshirtSize: string, pronouns?: string,
    allergies?: string, accessibilityReqs?: string,
    universityId?: number, studentId?: number): Promise<SessionIdObject | undefined> => {
    // use the user passed in to do some stuff and call the 
    // userRepository methods to interact with the db on behalf of the user.

    // return the sessionId of the student who registered
    return { sessionId: '0' };
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

  systemAdminCompetitionCreate = async (sessionId: string, name: string,
    earlyRegDeadline: EpochTimeStamp, generalRegDeadline: EpochTimeStamp,
    siteLocations: Array<UniversitySiteInput>): Promise<CompetitionCodeObject | undefined> => {

    // Once the competition is created return the code of it
    return { code: 'REG12345' };
  }

  systemAdminDashInfo = async (sessionId: string): Promise<SystemAdminDashInfo | undefined> => {

    return { preferredName: 'Name' };
  }

  
}