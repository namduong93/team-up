import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";


export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  studentRegister = async (sessionId: string, sessionTimestamp: EpochTimeStamp, name: string,
    preferredName: string, password: string, email: string, tshirtSize: string, pronouns?: string,
    allergies?: string, accessibilityReqs?: string,
    universityId?: number, studentId?: number): Promise<void | undefined> => {
    // Use the params to run an sql insert on the db
    return;
  }

  staffRegister = async (sessionId: string, sessionTimestamp: EpochTimeStamp, name: string,
    preferredName: string, password: string, email: string, tshirtSize: string, pronouns?: string,
    allergies?: string, accessibilityReqs?: string,
    universityId?: number): Promise<void | undefined> => {

    return;
  }

  userAuthenticate = async (email: string, password: string): Promise<UserIdObject | undefined> => {
    
    return { id: 1 };
  }

  userLogin = async (sessionId: string, sessionTimestamp: EpochTimeStamp, id: number): Promise<void | undefined> => {

    return;
  }

  userType = async (sessionId: string): Promise<UserTypeObject | undefined> => {

    return { type: 'student' };
  }

  studentDashInfo = async(sessionId: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionId: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  systemAdminDashInfo = async (sessionId: string): Promise<SystemAdminDashInfo | undefined> => {

    return { preferredName: 'Name' };
  }
}