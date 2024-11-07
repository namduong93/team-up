import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student } from "../../models/user/student/student.js";
import bcrypt from 'bcryptjs';
import { UserProfileInfo } from "../../models/user/user_profile_info.js";
import { Staff } from "../../models/user/staff/staff.js";
import { UserType, UserTypeObject } from "../../models/user/user.js";
import { UserDashInfo } from "../../models/user/user_dash_info.js";
import { DbError } from "../../errors/db_error.js";
import { University } from "../../models/university/university.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // TODO: handle sessionTimestamp
  studentRegister = async (student: Student): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db

    let name = student.name;
    let preferredName = student.preferredName;
    let email = student.email;
    let hashed_password = await bcrypt.hash(student.password, 10);
    let gender = student.gender;
    let pronouns = student.pronouns;
    let tshirtSize = student.tshirtSize;
    let allergies = student.allergies;
    let dietaryReqs = student.dietaryReqs || [];
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
    const userQuery =
    `INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs,
      user_type, university_id, student_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    const userValues = [
      name,
      preferredName,
      email,
      hashed_password,
      gender,
      pronouns,
      tshirtSize,
      allergies,
      dietaryReqs,
      accessibilityReqs,
      'student',
      student.universityId,
      student.studentId
    ];
    const userResult = await this.pool.query(userQuery, userValues);
    const newUserId = userResult.rows[0].id;

    return { userId: newUserId };
  }

  // TODO: Handle sessionTimestamp
  staffRegister = async (staff: Staff): Promise<UserIdObject | undefined> => {
    // Use the params to run an sql insert on the db

    let name = staff.name;
    let preferredName = staff.preferredName;
    let email = staff.email;
    let hashed_password = await bcrypt.hash(staff.password, 10);
    let gender = staff.gender;
    let pronouns = staff.pronouns;
    let tshirtSize = staff.tshirtSize;
    let allergies = staff.allergies;
    let dietaryReqs = staff.dietaryReqs || [];
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

    const userQuery = `INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs,
      user_type, university_id, student_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    const userValues = [
      name,
      preferredName,
      email,
      hashed_password,
      gender,
      pronouns,
      tshirtSize,
      allergies,
      dietaryReqs,
      accessibilityReqs,
      'staff',
      staff.universityId,
      null
    ];
    const userResult = await this.pool.query(userQuery, userValues);
    const newUserId = userResult.rows[0].id;

    return { userId: newUserId };
  }

  userAuthenticate = async (email: string, password: string): Promise<UserIdObject | undefined> => {

    return { userId: 1 };
  }

  userLogin = async (email: string, password: string): Promise<UserIdObject | undefined> => {

    const userQuery = `SELECT id, hashed_password FROM users WHERE email = $1;`;
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
    const userQuery = 
    `SELECT id, name, preferred_name AS "preferredName", email, affiliation, gender, pronouns,
      tshirt_size AS "tshirtSize", allergies, dietary_reqs AS "dietaryReqs",
      accessibility_reqs AS "accessibilityReqs" FROM user_profile_info WHERE id = $1 LIMIT 1`;
    const userResult = await this.pool.query(userQuery, [userId]);
    if (userResult.rowCount === 0) {
      return undefined; // User not found
    }
    return userResult.rows[0];
  }

  userUpdateProfile = async (userId : number, userProfile: UserProfileInfo): Promise<void> => {
    const userQuery = `
      UPDATE users 
      SET 
        name = $2,
        preferred_name = $3,
        email = $4,
        gender = $5,
        pronouns = $6,
        tshirt_size = $7,
        allergies = $8,
        dietary_reqs = $9,
        accessibility_reqs = $10
      WHERE id = $1;
    `;
    const userValues = [
      userId,
      userProfile.name,
      userProfile.preferredName,
      userProfile.email,
      userProfile.gender,
      userProfile.pronouns,
      userProfile.tshirtSize,
      userProfile.allergies,
      userProfile.dietaryReqs || [],
      userProfile.accessibilityReqs,
    ];
    await this.pool.query(userQuery, userValues);
    return ;
  }

  userUpdatePassword = async(userId: number, oldPassword: string, newPassword: string): Promise<void> => {
    const userQuery = `SELECT hashed_password FROM users WHERE id = $1;`;
    const userResult = await this.pool.query(userQuery, [userId]);

    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, "User not found");
    }

    // Check if old password is correct
    if (!await bcrypt.compare(oldPassword, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Query, "Current password is incorrect");
    }

    if (await bcrypt.compare(newPassword, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Query, "New password must be different from old password");
    }

    // Update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE users SET hashed_password = $2 WHERE id = $1;`;
    await this.pool.query(updateQuery, [userId, hashedPassword]);

    // Delete all associated sessions after the password update
    const deleteSessionsQuery = `DELETE FROM sessions WHERE user_id = $1;`;
    await this.pool.query(deleteSessionsQuery, [userId]);

    return;
  }

  userType = async (userId: number): Promise<UserTypeObject> => {

    const dbResult = await this.pool.query(
      `SELECT user_type AS "userType" FROM users WHERE id = ${userId}`
    );

    return { type: dbResult.rows[0].userType };
  }

  userDashInfo = async(userId: number): Promise<UserDashInfo | undefined> => {
    const dbResult = await this.pool.query(
      `SELECT preferred_name AS "preferredName", affiliation FROM user_dash_info WHERE id = ${userId}`
    );

    return dbResult.rows[0];
  }

  userUniversity = async (userId: number): Promise<University | undefined> => {
    const universityIdResult = await this.pool.query(`SELECT university_id FROM users WHERE id = $1`, [userId]);
    if (universityIdResult.rowCount === 0) {
      return undefined;
    }
    const universityId = universityIdResult.rows[0].university_id;
    const universityNameResult = await this.pool.query(`SELECT name FROM universities WHERE id = $1`, [universityId]);
    if (universityNameResult.rowCount === 0) {
      return undefined;
    }
    const universityName = universityNameResult.rows[0].name;
    return { id: universityId, name: universityName };
  }

}
