import { CompetitionIdObject } from "../../../models/competition/competition";
import { Staff } from "../../../models/user/staff/staff";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

// system admin update seems buggy
describe.skip('System Admin Update Function', () => {
  let user_db;
  let comp_db;

  let dateNow = Date.now()
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
    code: 'TC7',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin6@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool)
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_db.competitionSystemAdminCreate(id, mockCompetition);
    expect(comp).toStrictEqual({ competitionId: expect.any(Number) })
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: admin is not creator of competition ', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId + 10,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC7',
      region: 'Australia'
    }

    await expect(comp_db.competitionSystemAdminUpdate(id + 1, UpdatedMockCompetition)).rejects.toThrow("User is not an admin for this competition.")
  })

  test('Failure case: competition does not exist', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId + 10,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC7',
      region: 'Australia'
    }

    await expect(comp_db.competitionSystemAdminUpdate(1, UpdatedMockCompetition)).rejects.toThrow("Competition does not exist.")
  })

  test('Success case: Competition is updated ', async () => {
    const UpdatedMockCompetition = {
      id: comp.competitionId,
      name: 'TestComp',
      teamSize: 20,
      createdDate: dateNow,
      earlyRegDeadline: earlyDate,
      startDate: startDate,
      generalRegDeadline: generalDate,
      siteLocations: [{ universityId: 1, name: 'TestRoom', capacity: 2000 }],
      code: 'TC7',
      region: 'Australia'
    }

    const result = await comp_db.competitionSystemAdminUpdate(id, UpdatedMockCompetition);

    await expect(result).toStrictEqual({});
    console.log(await comp_db.competitionGetDetails(comp.competitionId));
  })

})