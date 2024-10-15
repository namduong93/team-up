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
    let dietaryReqs = student.dietaryReqs;
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
      INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

    let name = staff.name;
    let preferredName = staff.preferredName;
    let email = staff.email;
    let hashed_password = await bcrypt.hash(staff.password, 10);
    let gender = staff.gender;
    let pronouns = staff.pronouns;
    let tshirtSize = staff.tshirtSize;
    let allergies = staff.allergies;
    let dietaryReqs = staff.dietaryReqs;
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
      INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
    let returnUserProfInfo: UserProfileInfo = {
      name: "",
      preferredName: "",
      email: "",
      affiliation: "",
      gender: "",
      pronouns: "",
      tshirtSize: "",
      allergies: "",
      dietaryReqs: [],
      accessibilityReqs: "",
    };
    // Query to get user profile info
    const userQuery = `
      SELECT * FROM users WHERE id = $1 LIMIT 1;
    `;
    const userResult = await this.pool.query(userQuery, [userId]);
    if (userResult.rowCount === 0) {
      return undefined; // User not found
    }
    const userInfo = userResult.rows[0];

    returnUserProfInfo.name = userInfo.name;
    returnUserProfInfo.preferredName = userInfo.preferred_name;
    returnUserProfInfo.email = userInfo.email;
    returnUserProfInfo.gender = userInfo.gender;
    returnUserProfInfo.pronouns = userInfo.pronouns;
    returnUserProfInfo.tshirtSize = userInfo.tshirt_size;
    returnUserProfInfo.allergies = userInfo.allergies;
    returnUserProfInfo.dietaryReqs = userInfo.dietary_reqs;
    returnUserProfInfo.accessibilityReqs = userInfo.accessibility_reqs;

    // Get the university name
    const universityQuery = `
      SELECT name 
      FROM universities 
      WHERE id = (SELECT university_id FROM students WHERE user_id = $1);
    `;
    const universityResult = await this.pool.query(universityQuery, [userId]);
    let universityName : string;
    if (universityResult.rowCount > 0) {
      universityName = universityResult.rows[0].name;
    } else {
      const staffUniversityQuery = `
        SELECT name 
        FROM universities 
        WHERE id = (SELECT university_id FROM staffs WHERE user_id = $1);
      `;
      const staffUniversityResult = await this.pool.query(staffUniversityQuery, [userId]);
      universityName = staffUniversityResult.rows[0].name;
    }

    returnUserProfInfo.affiliation = universityName;
    // TODO: Add more fields to return
    return returnUserProfInfo;
  }

  userType = async (userId: number): Promise<UserTypeObject | undefined> => {
    const staff = `
      SELECT * FROM staffs WHERE user_id = $1;
    `;
    const staff_result = await this.pool.query(staff, [userId]);

    if (!staff_result.rowCount) {
      return { type: UserType.STUDENT };
    }
    else {
      const system_admin = `
        SELECT * FROM system_admins WHERE staff_id = $1;
      `;
      const system_admin_result = await this.pool.query(system_admin, [userId]);
      if (system_admin_result.rowCount > 0) {
        return { type: UserType.SYSTEM_ADMIN };
      }
      else {
        return { type: UserType.STAFF };
      }
    }
  }

  userDashInfo = async(userId: number): Promise<UserDashInfo | undefined> =>{
    const userDashInfo : UserDashInfo = {
      preferredName: "",
      affiliation: "",
    };
    
    const userQuery = `
      SELECT * FROM users WHERE id = $1 LIMIT 1;
    `;
    const userResult = await this.pool.query(userQuery, [userId]);
    if (!userResult.rowCount) {
      return undefined;
    }
    userDashInfo.preferredName = userResult.rows[0].preferred_name;

    const universityQuery = `
      SELECT name 
      FROM universities 
      WHERE id = (SELECT university_id FROM students WHERE user_id = $1);
    `;
    const universityResult = await this.pool.query(universityQuery, [userId]);

    if (universityResult.rowCount > 0) {
      userDashInfo.affiliation = universityResult.rows[0].name;
    } else {
      const staffUniversityQuery = `
        SELECT name 
        FROM universities 
        WHERE id = (SELECT university_id FROM staffs WHERE user_id = $1);
      `;
      const staffUniversityResult = await this.pool.query(staffUniversityQuery, [userId]);
      userDashInfo.affiliation = staffUniversityResult.rows[0].name;
    }
    return userDashInfo;
  }

}
