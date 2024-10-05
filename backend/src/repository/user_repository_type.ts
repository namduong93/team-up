
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { SessionIdObject, UserTypeObject } from "../services/user_service.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student } from "../models/user/student/student.js";
import { Staff } from "../models/user/staff/staff.js";

export type UserIdObject = { id: number };
export interface UserRepository {
  studentRegister(student: Student): Promise< UserIdObject | undefined>;

  staffRegister(staff: Staff): Promise<SessionIdObject | undefined>;

  userAuthenticate(email: string, password: string): Promise<UserIdObject | undefined>;
  userLogin(sessionId: string, sessionTimestamp: EpochTimeStamp, id: number): Promise<void | undefined>;

  userType(sessionId: string): Promise<UserTypeObject | undefined>;
  studentDashInfo(sessionId: string): Promise<StudentDashInfo | undefined>;
  staffDashInfo(sessionId: string): Promise<StaffDashInfo | undefined>;
  systemAdminDashInfo(sessionId: string): Promise<SystemAdminDashInfo | undefined>;

};