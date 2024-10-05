import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { SessionIdObject, UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { v4 as uuidv4 } from 'uuid';
import { Student, validateStudent } from "../../models/user/student/student.js";
import bcrypt from 'bcryptjs';
import { Staff, validateStaff } from "../../models/user/staff/staff.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // TODO: handle universityId, sessionTimestamp
  studentRegister = async (student : Student): Promise<SessionIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    student.email = await this.trimDotsForEmail(student.email);

    const validated = validateStudent(student);
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

  // TODO: Handle universityId, sessionTimestamp
  staffRegister = async (staff : Staff): Promise<SessionIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    staff.email = await this.trimDotsForEmail(staff.email);

    const validated = validateStaff(staff);
    if (validated) {
        throw new Error(validated);
    }

    let sessionId : string = uuidv4();
    let sessionTimestamp : EpochTimeStamp = Date.now();
    let name = staff.name;              
    let hashed_password = await bcrypt.hash(staff.password, 10); 
    let email = staff.email;             
    let tshirtSize = staff.tshirtSize;   
    let pronouns = staff.pronouns;       
    let allergies = staff.allergies;     
    let accessibilityReqs = staff.accessibilityReqs;     

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

    const staffQuery = `
      INSERT INTO staff (user_id)
      VALUES ($1)
      RETURNING *;
    `;
    const staffValues = [
      newUserId
    ];

    const studentResult = await this.pool.query(staffQuery, staffValues);
    return { sessionId: sessionId };
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
