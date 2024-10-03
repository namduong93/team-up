import { Staff } from "../models/user/staff/staff.js";
import { Student } from "../models/user/student/student.js";
import { User } from "../models/user/user.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";

export interface UserRepository {
  studentRegister(student: Student): Promise<Student | undefined>;
  staffRegister(staff: Staff): Promise<Staff | undefined>;
  userLogin(user: User): Promise<User | undefined>;
  userType(sessionId: string): Promise<string | undefined>;
  studentDashInfo(sessionId: string): Promise<StudentDashInfo | undefined>;
  staffDashInfo(sessionId: string): Promise<StaffDashInfo | undefined>;
};