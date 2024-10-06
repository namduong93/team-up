
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { UserTypeObject } from "../services/user_service.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student } from "../models/user/student/student.js";
import { Staff } from "../models/user/staff/staff.js";
import { UserProfileInfo } from "../models/user/user_profile_info.js";

export type UserIdObject = { userId: number };
export interface UserRepository {
  studentRegister(student: Student): Promise< UserIdObject | undefined>;

  staffRegister(staff: Staff): Promise<UserIdObject | undefined>;

  userAuthenticate(email: string, password: string): Promise<UserIdObject | undefined>;
  userLogin(sessionToken: string, sessionTimestamp: EpochTimeStamp, id: number): Promise<void | undefined>;

  userProfileInfo(userId: number): Promise<UserProfileInfo | undefined>;
  userType(sessionToken: string): Promise<UserTypeObject | undefined>;
  studentDashInfo(sessionToken: string): Promise<StudentDashInfo | undefined>;
  staffDashInfo(sessionToken: string): Promise<StaffDashInfo | undefined>;
  systemAdminDashInfo(sessionToken: string): Promise<SystemAdminDashInfo | undefined>;
};