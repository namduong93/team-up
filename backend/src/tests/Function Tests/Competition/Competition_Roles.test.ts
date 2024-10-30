import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Roles Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: returns an empty array', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionRoles(5, 2);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the users team details', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionRoles(5, 1);
    expect(result).toStrictEqual(['Participant'])
  })
})