import { CompetitionIdObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { Staff } from "../../../models/user/staff/staff";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

// should make more staff join the competition when you finish implementing the test for join
describe('Competition Staff Function', () => {
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
    code: 'TC6',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin5@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff1: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'ikenotbelifisnotstaff@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;
  let mockStaffId1: UserIdObject;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool)
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_db.competitionSystemAdminCreate(id, mockCompetition);
    mockStaffId1 = await user_db.staffRegister(mockStaff1);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Failure case: User has no access to the list', async () => {
    const result = await comp_db.competitionStaff(id + 1, comp.competitionId);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the staff list for competition', async () => {
    expect(await comp_db.competitionStaff(id, comp.competitionId)).toStrictEqual([{
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'dasOddodmin5@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      bio: '',
      roles: ['Admin'],
      access: 'Accepted'
    }])
  })

  test('Success case: when adding new staff', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1.userId,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    await comp_db.competitionStaffJoin(comp.competitionId, newAdmin);

    expect(await comp_db.competitionStaff(id, comp.competitionId)).toStrictEqual([
      {
        userId: id,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'dasOddodmin5@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Accepted'
      },
      {
        userId: mockStaffId1.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        email: 'ikenotbelifisnotstaff@odmin.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'M',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        bio: '',
        roles: ['Admin'],
        access: 'Pending'
      }
    ])
  })

})