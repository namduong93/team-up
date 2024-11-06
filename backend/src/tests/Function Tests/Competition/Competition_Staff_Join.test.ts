import { CompetitionIdObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { Staff } from "../../../models/user/staff/staff";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Staff Join Function', () => {
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
    code: 'TC8',
    region: 'Australia'
  }

  const mockStaff: Staff =  {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin7@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff1: Staff =  {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff1@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff2: Staff =  {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff2@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  const mockStaff3: Staff =  {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'mockerStaff3@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let mockStaffId1: number;
  let mockStaffId2: number;
  let mockStaffId3: number;
  let comp: number;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool)
    user = await user_db.staffRegister(mockStaff);
    id = user.userId;
    comp = await comp_db.competitionSystemAdminCreate(id, mockCompetition).competitionId;
    mockStaffId1 = await user_db.staffRegister(mockStaff1).userId;
    mockStaffId2 = await user_db.staffRegister(mockStaff2).userId;
    mockStaffId3 = await user_db.staffRegister(mockStaff3).userId;
    expect(comp).toStrictEqual({ competitionId: expect.any(Number) })
  });

  // export interface CompetitionStaff {
  //   userId: number;
  //   name?: string;
  //   email?: string;
  //   competitionRoles: Array<CompetitionUserRole>;
  //   accessLevel: CompetitionAccessLevel;
  //   siteLocation?: CompetitionSiteObject; // Coach + Site Coordinator
  //   university?: University; // Coach
  //   competitionBio?: string; // Coach
  // }

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Success case: adds new admin to the competition', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newAdmin)).toStrictEqual({});
    console.log(await comp_db.competitionGetDetails(comp));
  })
  test('Success case: adds new coach to the competition', async () => {
    const newCoach: CompetitionStaff = {
      userId: mockStaffId2,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newCoach)).toStrictEqual({});
    console.log(await comp_db.competitionGetDetails(comp));
  })
  test('Success case: adds new site coordinator to the competition', async () => {
    const newCoordinator: CompetitionStaff = {
      userId: mockStaffId3,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newCoordinator)).toStrictEqual({});
    console.log(await comp_db.competitionGetDetails(comp));
  })

  test('Fail case: user is already a admin for the competition', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newAdmin)).rejects.toThrow("User is already an admin for this competition.");
  })
  test('Fail case: user is already a coach for the competition', async () => {
    const newCoach: CompetitionStaff = {
      userId: mockStaffId2,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newCoach)).rejects.toThrow("User is already an coach for this competition.");
  })
  test('Fail case: user is already a site coordinator for the competition', async () => {
    const newCoordinator: CompetitionStaff = {
      userId: mockStaffId3,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    expect(await comp_db.competitionStaffJoin(comp, newCoordinator)).rejects.toThrow("User is already an site coordinator for this competition.");
  })
})