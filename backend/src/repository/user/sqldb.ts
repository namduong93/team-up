import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { Student } from "../../models/user/student/student.js";
import bcrypt from 'bcryptjs';
import { UserProfileInfo } from "../../models/user/user_profile_info.js";
import { Staff } from "../../models/user/staff/staff.js";
import { UserTypeObject } from "../../models/user/user.js";
import { UserDashInfo } from "../../models/user/user_dash_info.js";
import { DbError } from "../../errors/db_error.js";
import { University } from "../../models/university/university.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  studentRegister = async (student: Student): Promise<UserIdObject> => {
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

    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'Student with this email already exists');
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

  staffRegister = async (staff: Staff): Promise<UserIdObject> => {
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

    // Check if user with email already exists
    const checkUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
    const checkUserResult = await this.pool.query(checkUserQuery, [email]);
    if (checkUserResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'Staff with this email already exists');
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

  userLogin = async (email: string, password: string): Promise<UserIdObject> => {
    const userQuery = `SELECT id, hashed_password FROM users WHERE email = $1;`;
    const userResult = await this.pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User with email does not exist');
    }

    if (!await bcrypt.compare(password, userResult.rows[0].hashed_password)) {
      throw new DbError(DbError.Auth, 'Incorrect password');
    }

    return { userId: userResult.rows[0].id };
  }

  userProfileInfo = async (userId: number): Promise<UserProfileInfo> => {
    const userQuery =
      `SELECT id, name, preferred_name AS "preferredName", email, affiliation, gender, pronouns,
      tshirt_size AS "tshirtSize", allergies, dietary_reqs AS "dietaryReqs",
      accessibility_reqs AS "accessibilityReqs" FROM user_profile_info WHERE id = $1 LIMIT 1`;

    const userResult = await this.pool.query(userQuery, [userId]);
    if (userResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    return userResult.rows[0];
  }

  userUpdateProfile = async (userId: number, userProfile: UserProfileInfo): Promise<void> => {
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
    return;
  }

  userType = async (userId: number): Promise<UserTypeObject> => {

    const dbResult = await this.pool.query(
      `SELECT user_type AS "userType" FROM users WHERE id = ${userId}`
    );

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    return { type: dbResult.rows[0].userType };
  }

  userDashInfo = async (userId: number): Promise<UserDashInfo> => {
    const dbResult = await this.pool.query(
      `SELECT preferred_name AS "preferredName", affiliation FROM user_dash_info WHERE id = ${userId}`
    );

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }

    return dbResult.rows[0];
  }

  userUniversity = async (userId: number): Promise<University> => {
    const universityIdResult = await this.pool.query(`SELECT university_id FROM users WHERE id = $1`, [userId]);
    if (universityIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User not found');
    }
    const universityId = universityIdResult.rows[0].university_id;

    const universityNameResult = await this.pool.query(`SELECT name FROM universities WHERE id = $1`, [universityId]);
    if (universityNameResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'University not found');
    }
    const universityName = universityNameResult.rows[0].name;

    return { id: universityId, name: universityName };
  }
}
