import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Get Comp Id from Code Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: code does not exist', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionIdFromCode('TC1234');
    expect(result).toBe(undefined);
  })

  test('Sucess case: returns the users team details', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionIdFromCode('SPPR2024');
    expect(result).toBe(1);
  })
})