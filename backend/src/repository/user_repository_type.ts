import { Student } from "../models/user/student/student.js";
import { Staff } from "../models/user/staff/staff.js";
import { UserProfileInfo } from "../models/user/user_profile_info.js";
import { UserTypeObject } from "../models/user/user.js";
import { UserDashInfo } from "../models/user/user_dash_info.js";
import { University } from "../models/university/university.js";

export type UserIdObject = { userId: number };
export interface UserRepository {
  studentRegister(student: Student): Promise< UserIdObject | undefined>;
  staffRegister(staff: Staff): Promise<UserIdObject | undefined>;

  userAuthenticate(email: string, password: string): Promise<UserIdObject | undefined>;
  userLogin(email: string, password: string): Promise<UserIdObject | undefined>;

  userProfileInfo(userId: number): Promise<UserProfileInfo | undefined>;
  userUpdateProfile(userId: number, userProfile: UserProfileInfo): Promise<void>;

  userType(userId: number): Promise<UserTypeObject | undefined>;
  userDashInfo(userId: number): Promise<UserDashInfo | undefined>;

  userUniversity(userId: number): Promise<University | undefined>;
};