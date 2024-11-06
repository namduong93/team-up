import { Pool } from "pg";
import { UniversityListObject } from "../../models/university/university.js";
import { UniversityRepository } from "../university_repository_type.js";
import { Course } from "../../../shared_types/University/Course.js";

export class SqlDbUniversityRepository implements UniversityRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  universityCourses = async (userId: number): Promise<Array<Course>> => {
    
    const dbResult = await this.pool.query(
      `SELECT 
        c.id AS "courseId",
        c.name AS "courseName",
        category
      FROM courses AS c
      JOIN universities AS uni ON uni.id = c.university_id
      JOIN users AS u ON u.university_id = uni.id
      WHERE u.id = ${userId};`
    );

    return dbResult.rows;
  }

  universitiesList = async (): Promise<UniversityListObject | undefined> => {
    let universityQuery = `
      SELECT * FROM universities;
    `;
    const universityResult = await this.pool.query(universityQuery);
    const universitiesList: UniversityListObject = {
      universities: universityResult.rows.map(row => ({
        id: row.id,
        name: row.name,
      })),
    };
    return universitiesList;
  }
}