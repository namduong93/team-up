import { Pool } from "pg";
import { UserRepository } from "../user_repository_type.js";
import { Student } from "../../models/user/student/student.js";
import { Staff } from "../../models/user/staff/staff.js";
import { User } from "../../models/user/user.js";
import { UserJSON } from "../../models/user/user_json.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  studentRegister = async (student: Student): Promise<Student | undefined> => {
    // Use the params to run an sql insert on the db
    return new Student(1, '', '', '', '');
  }

  staffRegister = async (staff: Staff): Promise<Staff | undefined> => {

    return new Staff(1, '', '', '', '');
  }

  userLogin = async (user: User): Promise<User | undefined> => {

    return new User(1, '', '', '', '');
  }

  userType = async (sessionId: string): Promise<string | undefined> => {

    return 'student';
  }

  studentDashInfo = async(sessionId: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionId: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }
}