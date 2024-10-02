import { Pool } from "pg";
import { UserRepository } from "../user_repository_type.js";
import { Student } from "../../models/user/student/student.js";

export class SqlDbUserRepository implements UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  addStudent = async (student: Student): Promise<Student | undefined> => {
    // Use the params to run an sql insert on the db
    return new Student(1, '', '', '', '');
  }
}