import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { SessionIdObject, UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { v4 as uuidv4 } from 'uuid';
import { StudentJSON, validate } from "../../models/user/student/student_json.js";
import bcrypt from 'bcryptjs';

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  studentRegister = async (student : StudentJSON): Promise< SessionIdObject| undefined> => {
    // Use the params to run an sql insert on the db
    student.email = await this.trimDotsForEmail(student.email);

    const validated = validate(student);
    if (validated) {
        throw new Error(validated);
    }

    let sessionId : string = uuidv4();
    let sessionTimestamp : EpochTimeStamp = Date.now();
    let name = student.name;              
    let hashed_password = await bcrypt.hash(student.password, 10); 
    let email = student.email;             
    let tshirtSize = student.tshirtSize;   
    let pronouns = student.pronouns;       
    let allergies = student.allergies;     
    let accessibilityReqs = student.accessibilityReqs; 
    let studentId = student.studentId;     

    const userQuery = `
      INSERT INTO users (name, hashed_password, email, tshirt_size, pronouns, allergies, accessibility_reqs)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const userValues = [
      name,
      hashed_password,
      email,
      tshirtSize,
      pronouns,
      allergies,
      accessibilityReqs,
    ];
    const userResult = await this.pool.query(userQuery, userValues);
    const newUserId = userResult.rows[0].id; 
    const studentQuery = `
      INSERT INTO students (user_id, student_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const studentValues = [
      newUserId,
      studentId
    ];

    const studentResult = await this.pool.query(studentQuery, studentValues);
    return { sessionId: sessionId };
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

  async trimDotsForEmail(email: string): Promise<string> {
    return email.replace(/\./g, "");
  }
}
