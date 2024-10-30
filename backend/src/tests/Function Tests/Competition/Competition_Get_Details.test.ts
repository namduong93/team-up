import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Get Details Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: Competition does not exist', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionGetDetails(10);
    expect(result).toStrictEqual(undefined);
  })

  test('Sucess case: returns the competition details', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionGetDetails(1);
    expect(result).toStrictEqual({
      id: 1,
      name: 'South Pacific Preliminary Contest 2024',
      teamSize: 3,
      createdDate: new Date('2024-06-30 00:00:00'),
      earlyRegDeadline: new Date('2024-08-29 00:00:00'),
      generalRegDeadline: new Date('2024-08-31 00:00:00'),
      startDate: new Date('2025-09-30 00:00:00'),
      code: 'SPPR2024',
      region: 'Australia',
      siteLocations: [{ universityId: 1, name: 'Library', capacity: 100 }]
    })
  })
})