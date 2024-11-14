import { CompetitionIdObject } from "../../../models/competition/competition";
import { Staff } from "../../../models/user/staff/staff";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Get Details Function', () => {
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
    siteLocations: [{
      universityId: 1,
      name: 'TestRoom',
      capacity: 2000
    }],
    code: 'TC2',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin1@odmin.com',
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
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: Competition does not exist', async () => {
    await expect(comp_db.competitionGetDetails(comp.competitionId + 10000)).rejects.toThrow("Competition does not exist.")
  })

  test('Sucess case: returns the competition details', async () => {
    expect(await comp_db.competitionGetDetails(comp.competitionId)).toStrictEqual({
      id: comp.competitionId,
      name: 'TestComp',
      teamSize: 5,
      createdDate: new Date(dateNow),
      earlyRegDeadline: new Date(earlyDate),
      generalRegDeadline: new Date(generalDate),
      startDate: new Date(startDate),
      code: 'TC2',
      information: null,
      region: 'Australia',
      siteLocations: [{
        universityId: 1,
        name: 'undefined',
        capacity: 0,
        id: expect.any(Number)
      }]
    })
  })
})
