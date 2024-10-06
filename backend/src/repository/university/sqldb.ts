import { Pool } from "pg";
import { UniversityListObject } from "../../models/university/university.js";
import { UniversityRepository } from "../university_repository_type.js";

export class SqlDbUniversityRepository implements UniversityRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
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