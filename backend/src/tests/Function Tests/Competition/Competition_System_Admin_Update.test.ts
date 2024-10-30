import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe.skip('System Admin Update Function', () => {
  let poolean;

  const testDbName = "capstone_db"
  let user_db;
  let mockCompetition;
  let compId;

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
    user_db = new SqlDbCompetitionRepository(poolean);
    mockCompetition = {
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

    compId = await user_db.competitionSystemAdminCreate(1, mockCompetition);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: admin is not creator of competition ', async () => {
    const UpdatedMockCompetition = {
      id: compId.competitionId,
      name: 'TestComp',
      teamSize: 10,
      createdDate: Date.now(),
      earlyRegDeadline: Date.now() + (365 * 1000 * 60 * 60 * 24),
      startDate: Date.now() + (420 * 1000 * 60 * 60 * 24),
      generalRegDeadline: Date.now() + (395 * 1000 * 60 * 60 * 24),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC1234',
      region: 'Australia'
    }

    await expect(user_db.competitionSystemAdminUpdate(2, UpdatedMockCompetition)).rejects.toThrow("User is not an admin for this competition.")
  })

  test('Failure case: competition does not exist', async () => {
    const UpdatedMockCompetition = {
      id: compId.competitionId + 10,
      name: 'TestComp',
      teamSize: 10,
      createdDate: Date.now(),
      earlyRegDeadline: Date.now() + (365 * 1000 * 60 * 60 * 24),
      startDate: Date.now() + (420 * 1000 * 60 * 60 * 24),
      generalRegDeadline: Date.now() + (395 * 1000 * 60 * 60 * 24),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC1234',
      region: 'Australia'
    }

    await expect(user_db.competitionSystemAdminUpdate(1, UpdatedMockCompetition)).rejects.toThrow("Competition does not exist.")
  })

  test('Success case: Competition is updated ', async () => {
    const UpdatedMockCompetition = {
      id: compId.competitionId,
      name: 'TestComp',
      teamSize: 10,
      createdDate: Date.now(),
      earlyRegDeadline: Date.now() + (365 * 1000 * 60 * 60 * 24),
      startDate: Date.now() + (420 * 1000 * 60 * 60 * 24),
      generalRegDeadline: Date.now() + (395 * 1000 * 60 * 60 * 24),
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC1234',
      region: 'Australia'
    }

    const result = await user_db.competitionSystemAdminUpdate(1, UpdatedMockCompetition)

    await expect(result).toStrictEqual({})
  })

})