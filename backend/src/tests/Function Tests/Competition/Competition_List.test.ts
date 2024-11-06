import { CompetitionIdObject } from "../../../models/competition/competition";
import { Staff } from "../../../models/user/staff/staff";
import { UserType } from "../../../models/user/user";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition List Function', () => {
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
    code: 'TC4',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin3@odmin.com',
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

  test('Sucess case: returns the users competition list', async () => {
    expect(await comp_db.competitionsList(id, UserType.STAFF)).toStrictEqual([
      {
        compId: comp.competitionId,
        compName: 'TestComp',
        location: 'Australia',
        compDate: new Date(earlyDate - (1000 * 60 * 60 * 11)),
        roles: ['Admin'],
        compCreatedDate: new Date(dateNow - (1000 * 60 * 60 * 11))
      }
    ])
  })
})