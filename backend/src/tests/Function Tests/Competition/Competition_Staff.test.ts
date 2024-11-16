import { UserAccess } from "../../../../shared_types/User/User";
import { CompetitionIdObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { Staff } from "../../../models/user/staff/staff";
import { SqlDbCompetitionRepository } from "../../../repository/competition/SqlDbCompetitionRepository";
import { SqlDbCompetitionStaffRepository } from "../../../repository/competition_staff/SqlDbCompetitionStaffRepository";
import { SqlDbCompetitionStudentRepository } from "../../../repository/competition_student/SqlDbCompetitionStudentRepository";
import { SqlDbUserRepository } from "../../../repository/user/SqlDbUserRepository";
import { UserIdObject } from "../../../repository/UserRepository";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Staff Function', () => {
  let user_db;
  let comp_db;
  let comp_staff_db;
  let comp_student_db;

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
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool)
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);
    mockStaffId1 = await user_db.staffRegister(mockStaff1);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Failure case: User has no access to the list', async () => {
    const result = await comp_staff_db.competitionStaff(id + 1, comp.competitionId);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns the staff list for competition', async () => {
    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([{
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
      access: 'Accepted',
      userAccess: 'Pending'
    }])
  })

  test('Success case: when adding new staff', async () => {
    const newAdmin: CompetitionStaff = {
      userId: mockStaffId1.userId,
      competitionRoles: [CompetitionUserRole.ADMIN],
      accessLevel: CompetitionAccessLevel.ACCEPTED
    }

    await comp_staff_db.competitionStaffJoin(comp.competitionId, newAdmin);

    expect(await comp_staff_db.competitionStaff(id, comp.competitionId)).toStrictEqual([
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
        access: 'Accepted',
        userAccess: 'Pending'
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
        access: 'Pending',
        userAccess: 'Pending'
      }
    ])
  })

})