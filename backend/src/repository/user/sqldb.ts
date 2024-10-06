import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student, validateStudent } from "../../models/user/student/student.js";
import bcrypt from 'bcryptjs';
import { Staff, validateStaff } from "../../models/user/staff/staff.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // TODO: handle sessionTimestamp
  studentRegister = async (student : Student): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    student.email = await this.trimDotsForEmail(student.email);

    const validated = validateStudent(student);
    if (validated) {
        throw new Error(validated);
    }
    let name = student.name;              
    let hashed_password = await bcrypt.hash(student.password, 10); 
    let email = student.email;             
    let tshirtSize = student.tshirtSize;   
    let pronouns = student.pronouns;       
    let allergies = student.allergies;     
    let accessibilityReqs = student.accessibilityReqs; 
    let universityId = student.universityId;
    let studentId = student.studentId;     

    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
        throw new Error('Student with this email already exists');
    }

    //Add user to users table
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

    // Add student to students table
    const studentQuery = `
      INSERT INTO students (user_id, university_id, student_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const studentValues = [
      newUserId,
      universityId,
      studentId
    ];

    const studentResult = await this.pool.query(studentQuery, studentValues);
    return { userId: newUserId };
  }

  // TODO: Handle sessionTimestamp
  staffRegister = async (staff : Staff): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    staff.email = await this.trimDotsForEmail(staff.email);

    const validated = validateStaff(staff);
    if (validated) {
        throw new Error(validated);
    }

    let name = staff.name;              
    let hashed_password = await bcrypt.hash(staff.password, 10); 
    let email = staff.email;             
    let tshirtSize = staff.tshirtSize;   
    let pronouns = staff.pronouns;       
    let allergies = staff.allergies;     
    let accessibilityReqs = staff.accessibilityReqs;
    let universityId = staff.universityId;   
    
    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
        throw new Error('Staff with this email already exists');
    }

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
      INSERT INTO staff (user_id, university_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const staffValues = [
      newUserId, 
      universityId
    ];

    const staffResult = await this.pool.query(staffQuery, staffValues);
    return { userId: newUserId };
  }

  userAuthenticate = async (email: string, password: string): Promise<UserIdObject | undefined> => {

    return { userId: 1 };
  }

  userLogin = async (email: string, password: string): Promise<UserIdObject | undefined> => {
    if(!email || email.length === 0) {
      throw new Error('Email is required');
    }
    email = await this.trimDotsForEmail(email);

    if(!password || password.length === 0) {
      throw new Error('Password is required');
    }

    const userQuery = `
      SELECT * FROM users WHERE email = $1;
    `;
    const userResult = await this.pool.query(userQuery, [email]);

    if(userResult.rowCount === 0) {
      throw new Error('User with this email does not exist');
    }
    if(!await bcrypt.compare(password, userResult.rows[0].hashed_password)) {
      throw new Error('Incorrect password');
    }

    return { userId: userResult.rows[0].id };
  }

  userType = async (sessionToken: string): Promise<UserTypeObject | undefined> => {

    return { type: 'student' };
  }

  studentDashInfo = async(sessionToken: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionToken: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  systemAdminDashInfo = async (sessionToken: string): Promise<SystemAdminDashInfo | undefined> => {

    return { preferredName: 'Name' };
  }

  async trimDotsForEmail(email: string): Promise<string> {
    return email.replace(/\./g, "");
  }
}
