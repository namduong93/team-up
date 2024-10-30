import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Get Comp Id from Code Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: code does not exist', async () => {
    const result = await user_db.competitionIdFromCode('WOBWOB');
    expect(result).toBe(undefined);
  })

  test('Sucess case: returns the users team details', async () => {
    const result = await user_db.competitionIdFromCode('SPPR2024');
    expect(result).toBe(1);
  })
})