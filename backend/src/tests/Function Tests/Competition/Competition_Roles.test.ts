import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Roles Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: returns an empty array', async () => {

    const result = await user_db.competitionRoles(5, 2);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the users team details', async () => {
    const result = await user_db.competitionRoles(5, 1);
    expect(result).toStrictEqual(['Participant'])
  })
})