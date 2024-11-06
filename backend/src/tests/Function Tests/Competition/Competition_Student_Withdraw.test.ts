import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

// needs Student join
describe.skip('Student Withdraw Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test.skip('Sucess case: returns the users team details', async () => {
    
  })
})