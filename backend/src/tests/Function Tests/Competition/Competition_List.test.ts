import { UserType } from "../../../models/user/user";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition List Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Sucess case: returns the users competition list', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);

    const result = await user_db.competitionsList(5, UserType.SYSTEM_ADMIN);

    expect(result).toStrictEqual([
      {
        compId: 1,
        compName: 'South Pacific Preliminary Contest 2024',
        location: 'Australia',
        compDate: new Date('2024-08-29 00:00:00'),
        roles: ['Participant'],
        compCreatedDate: new Date('2024-06-30 00:00:00')
      }
    ])
  })
})