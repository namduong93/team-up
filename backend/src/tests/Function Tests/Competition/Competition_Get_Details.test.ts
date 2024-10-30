import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Get Details Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: Competition does not exist', async () => {
    const result = await user_db.competitionGetDetails(10);
    expect(result).toStrictEqual(undefined);
  })

  test('Sucess case: returns the competition details', async () => {
    const result = await user_db.competitionGetDetails(1);
    expect(result).toStrictEqual({
      id: 1,
      name: 'South Pacific Preliminary Contest 2024',
      teamSize: 3,
      createdDate: new Date('2024-06-30T00:00:00Z'),
      earlyRegDeadline: new Date('2024-08-29T00:00:00Z'),
      generalRegDeadline: new Date('2024-08-31T00:00:00Z'),
      startDate: new Date('2025-09-30T00:00:00Z'),
      code: 'SPPR2024',
      region: 'Australia',
      siteLocations: [{ universityId: 1, name: 'Library', capacity: 100 }]
    })
  })
})