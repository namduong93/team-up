import { SqlDbCompetitionRepository } from "../repository/competition/sqldb";
import pool from "./test_util/test_utilities";

describe('User Type Function', () => {
  let comp_db;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
  });


  afterAll(async () => {
    await pool.end();
  });

  test('Sucess case: returns list of staff', async () => {
    console.log(await comp_db.competitionStaffList(1, 1))
  })
})