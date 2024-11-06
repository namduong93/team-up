import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

// have not been implemented
describe.skip('Staff Register Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Sucess case: returns the users team details', async () => {
    const result = await user_db.competitionTeamDetails(5, 1);

    expect(result).toStrictEqual({
      compName: 'South Pacific Preliminary Contest 2024',
      src_competition_id: 1,
      teamName: 'Charmander',
      teamSite: 'Computer Science Building',
      teamSeat: 'Tabla01',
      teamLevel: 'Level A',
      startDate: new Date('2025-09-30T00:00:00Z'),
      students: [
        {
          userId: 5,
          name: 'New User',
          email: 'student@example.com',
          bio: 'epic bio',
          preferredContact: 'Email:example@email.com',
          ICPCEligible: true,
          level: 'Level A',
          boersenEligible: true,
          isRemote: false
        },
        {
          userId: 6,
          name: 'Test Student Account 2',
          email: 'teststudent2@example.com',
          bio: 'epic bio',
          preferredContact: 'Discord:fdc234',
          ICPCEligible: true,
          level: 'Level A',
          boersenEligible: true,
          isRemote: false
        },
        {
          userId: 7,
          name: 'Test Student Account 3',
          email: 'teststudent3@example.com',
          bio: 'epic bio',
          preferredContact: 'Phone:0413421311',
          ICPCEligible: true,
          level: 'Level A',
          boersenEligible: true,
          isRemote: false
        }
      ],
      coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
    })
  })
})