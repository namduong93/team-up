import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Staff Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Failure case: User has no access to the list', async () => {
    const result = await user_db.competitionStaff(2, 1);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the staff list for competition', async () => {
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
        name: 'Algorithm Coach',
        roles: [ 'Coach' ],
        universityName: 'University of New South Wales',
        access: 'Pending',
        email: 'raveen@example.com'
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