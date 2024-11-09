import { CompetitionIdObject, CompetitionSiteObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { University } from "../../../models/university/university";
import { Staff } from "../../../models/user/staff/staff";
import { Student } from "../../../models/user/student/student";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Student Join Competition Function', () => {
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
    code: 'TC8',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin7@odmin.com',
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

    const userSiteLocation: CompetitionSiteObject = {
      id: 1,
      name: 'the place in the ring',
    }
    const newCoach: CompetitionStaff = {
      userId: id,
      competitionRoles: [CompetitionUserRole.COACH],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      university: {
        id: 1,
        name: 'University of Melbourne'
      },
      competitionBio: 'i good, trust',
      siteLocation: userSiteLocation
    }
    const newCoordinator: CompetitionStaff = {
      userId: id,
      competitionRoles: [CompetitionUserRole.SITE_COORDINATOR],
      accessLevel: CompetitionAccessLevel.ACCEPTED,
      siteLocation: userSiteLocation
    }
    await comp_db.competitionStaffJoin(comp.competitionId, newCoach);
    await comp_db.competitionStaffJoin(comp.competitionId, newCoordinator);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: university is not signed up to the competition', async () => {
    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'iwobuppies@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 2,
      studentId: 'z5381412'
    };

    const newStudent: UserIdObject = await user_db.studentRegister(mockStudent);

    const newContender: CompetitionUser = {
      userId: newStudent.userId,
      competitionId: comp.competitionId,
      competitionRoles: [CompetitionUserRole.PARTICIPANT],
      ICPCEligible: true,
      competitionLevel: 'No Preference',
      siteLocation: {
        id: 1,
        name: 'TestRoom',
      },
      boersenEligible: true,
      degreeYear: 3,
      degree: 'ComSci',
      isRemote: true,
      nationalPrizes: 'none',
      internationalPrizes: 'none',
      codeforcesRating: 7,
      universityCourses: ['4511', '9911', '911'],
      pastRegional: true,
      competitionBio: 'I good, promise',
      preferredContact: 'Pigeon Carrier',
    }

    const studentUni: University = {
      id: 2,
      name: 'Monash University'
    }
    await expect(comp_db.competitionStudentJoin(newContender, studentUni)).rejects.toThrow("Your university is not registered for this competition.")
  })

  test('Sucess case: returns the users team details', async () => {
    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'igibupman@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    const newStudent: UserIdObject = await user_db.studentRegister(mockStudent);

    const newContender: CompetitionUser = {
      userId: newStudent.userId,
      competitionId: comp.competitionId,
      competitionRoles: [CompetitionUserRole.PARTICIPANT],
      ICPCEligible: true,
      competitionLevel: 'No Preference',
      siteLocation: {
        id: 1,
        name: 'TestRoom',
      },
      boersenEligible: true,
      degreeYear: 3,
      degree: 'ComSci',
      isRemote: true,
      nationalPrizes: 'none',
      internationalPrizes: 'none',
      codeforcesRating: 7,
      universityCourses: ['4511', '9911', '911'],
      pastRegional: true,
      competitionBio: 'I good, promise',
      preferredContact: 'Pigeon Carrier',
    }

    const studentUni: University = {
      id: 1,
      name: 'University of Melbourne'
    }
    await comp_db.competitionStudentJoin(newContender, studentUni)
    expect(await comp_db.competitionStudents(id, comp.competitionId)).toStrictEqual([
      {
        userId: newStudent.userId,
        universityId: 1,
        universityName: 'University of Melbourne',
        name: 'Maximillian Maverick',
        preferredName: 'X',
        email: 'igibupman@gmail.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'L',
        allergies: null,
        dietaryReqs: '{}',
        accessibilityReqs: null,
        studentId: 'z5381412',
        roles: ['Participant'],
        bio: 'I good, promise',
        ICPCEligible: true,
        boersenEligible: true,
        level: 'No Preference',
        degreeYear: 3,
        degree: 'ComSci',
        isRemote: true,
        isOfficial: null,
        preferredContact: 'Pigeon Carrier',
        nationalPrizes: 'none',
        internationalPrizes: 'none',
        codeforcesRating: 7,
        universityCourses: ['4511', '9911', '911'],
        pastRegional: true,
        status: 'Matched',
        teamName: 'Bulbasaur',
        siteName: 'Library',
        siteId: 1
      }
    ])
  })
})