import { Pool } from "pg";
import { UserIdObject, UserRepository } from "../user_repository_type.js";
import { StudentDashInfo } from "../../models/user/student/student_dash_info.js";
import { StaffDashInfo } from "../../models/user/staff/staff_dash_info.js";
import { SessionIdObject, UserTypeObject } from "../../services/user_service.js";
import { SystemAdminDashInfo } from "../../models/user/staff/system_admin/system_admin_dash_info.js";
import { Student, validate } from "../../models/user/student/student.js";
import { v4 as uuidv4 } from 'uuid';

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  studentRegister = async (student : Student): Promise< SessionIdObject| undefined> => {
    // Use the params to run an sql insert on the db
    student.setEmail(await this.trimDotsForEmail(student.getEmail()));

    const validated = validate(student);
    if (validated) {
        throw new Error(validated);
    }

    let sessionId : string = uuidv4();
    let sessionTimestamp : EpochTimeStamp = Date.now();
    let user_id = student.getId();
    let name = student.getName();              
    let hashed_password = student.getHashedPassword(); 
    let email = student.getEmail();             
    let tshirtSize = student.getTshirtSize();   
    let pronouns = student.getPronouns();       
    let allergies = student.getAllergies();     
    let accessibilityReqs = student.getAccessibilityReqs(); 
    // let universityId = student.getUniversity?.()?.getId();  
    let studentId = student.getStudentId();     

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
      INSERT INTO students (user_id, university_id, student_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const studentValues = [
      newUserId,
      // universityId,
      studentId
    ];

    const studentResult = await this.pool.query(studentQuery, studentValues);

    // const query2 = `
    //   INSERT INTO sessions (session_id, session_timestamp, user_id) VALUES
    //   ($1, $2, (SELECT id FROM students WHERE user_id = $3)) RETURNING *;
    // `;
    // const values2 = [
    //   sessionId,
    //   sessionTimestamp,
    //   user_id
    // ];
    // const result2 = await this.pool.query(query2, values2);
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

// async create(user: User): Promise<User | null> {

//   user.id = Math.floor(Date.now() / 1000);
//   const validated = validate(user);
//   if (validated) {
//       throw new Error(validated);
//   }
          
//   user.email = await this.trimDotsForEmail(user.email);
//   user.hashed_password = await bcrypt.hash(user.hashed_password, 10);

//   const query = `
//       INSERT INTO users (id, name, hashed_password, email, tshirt_size) VALUES
//       ($1, $2, $3, $4, $5) RETURNING *;
//   `;
//   const values = [
//       user.id,
//       user.name,
//       user.hashed_password,
//       user.email,
//       user.tshirt_size,
//   ];

//   try {
//       const result = await this.pool.query(query, values);
//       return result.rows[0]; // Return the created user
//   } catch (err) {
//       console.error("Error creating user in SQL database:", err);
//       throw err; // Propagate error to the caller
//   }
// }