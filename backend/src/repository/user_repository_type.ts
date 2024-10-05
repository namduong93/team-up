
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { SessionIdObject, UserTypeObject } from "../services/user_service.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { StudentJSON } from "../models/user/student/student_json.js";

export type UserIdObject = { id: number };
export interface UserRepository {
  studentRegister(student: StudentJSON): Promise< SessionIdObject | undefined>;

  staffRegister(sessionId: string, sessionTimestamp: EpochTimeStamp, name: string, preferredName: string,
    password: string, email: string, tshirtSize: string, pronouns?: string,
    allergies?: string, accessibilityReqs?: string,
    universityId?: number): Promise<void | undefined>;

  userAuthenticate(email: string, password: string): Promise<UserIdObject | undefined>;
  userLogin(sessionId: string, sessionTimestamp: EpochTimeStamp, id: number): Promise<void | undefined>;

  userType(sessionId: string): Promise<UserTypeObject | undefined>;
  studentDashInfo(sessionId: string): Promise<StudentDashInfo | undefined>;
  staffDashInfo(sessionId: string): Promise<StaffDashInfo | undefined>;
  systemAdminDashInfo(sessionId: string): Promise<SystemAdminDashInfo | undefined>;

};