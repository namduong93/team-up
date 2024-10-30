import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('System Admin Create Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: Code in use', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);

    const mockCompetition = {
      name: 'TestComp',
      teamSize: 5,
      createdDate: Date.now(),
      earlyRegDeadline: Date.now() + (365 * 1000 * 60 * 60 * 24),
      startDate: Date.now() + (420 * 1000 * 60 * 60 * 24),
      generalRegDeadline: Date.now() + (395 * 1000 * 60 * 60 * 24),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'SPPR2024',
      region: 'Australia'
    }

    const result = await user_db.competitionSystemAdminCreate(1, mockCompetition);
    expect(result).toStrictEqual(undefined)
  })

  test('Sucess case: returns the users team details', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);

    const mockCompetition = {
      name: 'TestComp',
      teamSize: 5,
      createdDate: Date.now(),
      earlyRegDeadline: Date.now() + (365 * 1000 * 60 * 60 * 24),
      startDate: Date.now() + (420 * 1000 * 60 * 60 * 24),
      generalRegDeadline: Date.now() + (395 * 1000 * 60 * 60 * 24),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC1234',
      region: 'Australia'
    }

    const result = await user_db.competitionSystemAdminCreate(1, mockCompetition);
    expect(result).toStrictEqual({ competitionId: 5 })
  })
})