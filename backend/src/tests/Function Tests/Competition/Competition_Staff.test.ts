import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Staff Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: User has no access to the list', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStaff(2, 1);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the staff list for competition', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStaff(1, 1);
    expect(result).toStrictEqual([
      {
        userId: 1,
        name: 'System Admin',
        roles: ['Admin'],
        universityName: 'University of Melbourne',
        access: 'Accepted',
        email: 'admin@example.com'
      },
      {
        userId: 2,
        name: 'Coach 1',
        roles: ['Coach'],
        universityName: 'Monash University',
        access: 'Accepted',
        email: 'coach@example.com'
      },
      {
        userId: 4,
        name: 'Site Coordinator 1',
        roles: ['Site-Coordinator'],
        universityName: 'Monash University',
        access: 'Accepted',
        email: 'testsitecoor1@example.com'
      },
      {
        userId: 3,
        name: 'Coach 2',
        roles: ['Coach'],
        universityName: 'RMIT University',
        access: 'Pending',
        email: 'testcoach2@example.com'
      },
      {
        userId: 11,
        name: 'Coach 3',
        roles: ['Coach'],
        universityName: 'RMIT University',
        access: 'Rejected',
        email: 'testcoach3@example.com'
      }
    ])
  })
})