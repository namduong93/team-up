import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student } from "../../models/user/student/student.js";
import bcrypt from 'bcryptjs';
import { UserProfileInfo } from "../../models/user/user_profile_info.js";
import { Staff } from "../../models/user/staff/staff.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // TODO: handle sessionTimestamp
  studentRegister = async (student: Student): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    student.email = await this.trimDotsForEmail(student.email);

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
      return undefined;
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
  staffRegister = async (staff: Staff): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db
    staff.email = await this.trimDotsForEmail(staff.email);

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
      return undefined;
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
      INSERT INTO staffs (user_id, university_id)
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
    email = await this.trimDotsForEmail(email);

    const userQuery = `
      SELECT * FROM users WHERE email = $1;
    `;
    const userResult = await this.pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      return undefined;
    }
    if (!await bcrypt.compare(password, userResult.rows[0].hashed_password)) {
      return undefined;
    }

    return { userId: userResult.rows[0].id };
  }

  userProfileInfo = async (userId: number): Promise<UserProfileInfo | undefined> => {
    // Query to get user profile info
    const userQuery = `
      SELECT name, email
      FROM users
      WHERE id = $1;
    `;

    const userResult = await this.pool.query(userQuery, [userId]);

    if (userResult.rowCount === 0) {
      return undefined; // User not found
    }

    const userInfo = userResult.rows[0];

    // Get the university name
    const universityQuery = `
      SELECT name 
      FROM universities 
      WHERE id = (SELECT university_id FROM students WHERE user_id = $1);
    `;

    const universityResult = await this.pool.query(universityQuery, [userId]);
    const universityName = universityResult.rowCount > 0 ? universityResult.rows[0].name : undefined;

    // TODO: Add more fields to return
    return {
      name: userInfo.name,
      email: userInfo.email,
      university: universityName,
    };
  }

  userType = async (userId: number): Promise<UserTypeObject | undefined> => {
    const staff = `
      SELECT * FROM staffs WHERE user_id = $1;
    `;
    const staff_result = await this.pool.query(staff, [userId]);

    if (!staff_result.rowCount) {
      return { type: 'student' };
    }
    else {
      const system_admin = `
        SELECT * FROM system_admins WHERE staff_id = $1;
      `;
      const system_admin_result = await this.pool.query(system_admin, [userId]);
      if (system_admin_result.rowCount > 0) {
        return { type: 'system_admin' };
      }
      else {
        return { type: 'staff' };
      }
    }
  }

  studentDashInfo = async (sessionToken: string): Promise<StudentDashInfo | undefined> => {

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
