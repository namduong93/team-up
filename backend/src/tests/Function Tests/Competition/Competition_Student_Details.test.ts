import { CompetitionIdObject, CompetitionSiteObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { University } from "../../../models/university/university";
import { Staff } from "../../../models/user/staff/staff";
import { Student } from "../../../models/user/student/student";
import { SqlDbCompetitionRepository } from "../../../repository/competition/SqlDbCompetitionRepository";
import { SqlDbUserRepository } from "../../../repository/user/SqlDbUserRepository";
import { UserIdObject } from "../../../repository/UserRepository";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Student Details Function', () => {
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
    code: 'TC11',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin10@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 1,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;
  let newStudent: UserIdObject;

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

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newStudentSacrifice2@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    newStudent = await user_db.studentRegister(mockStudent);

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
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: user is not in this competition or isnt a participant', async () => {
    await expect(comp_db.competitionStudentDetails(newStudent.userId + 1, comp.competitionId)).rejects.toThrow('User does not exist or is not a participant in this competition.');
  })

  test('Sucess case: returns the users team details', async () => {
    expect(await comp_db.competitionStudentDetails(newStudent.userId, comp.competitionId)).toStrictEqual(
      {
        name: 'Maximillian Maverick',
        email: 'newStudentSacrifice2@gmail.com',
        accessibilityReqs: null,
        allergies: null,
        bio: "I good, promise",
        isOfficial: null,
        level: "No Preference",
        preferredContact: 'Pigeon Carrier',
        dietaryReqs: "{}",
        ICPCEligible: true,
        boersenEligible: true,
        degreeYear: 3,
        degree: 'ComSci',
        isRemote: true,
        nationalPrizes: 'none',
        preferredName: "X",
        pronouns: "He/Him",
        roles: "{Participant}",
        sex: "Male",
        status: "Accepted",
        studentId: "z5381412",
        tshirtSize: "L",
        internationalPrizes: 'none',
        codeforcesRating: 7,
        universityCourses: ['4511', '9911', '911'],
        pastRegional: true,
        universityId: 1,
        universityName: "University of Melbourne",
        userId: newStudent.userId,
      }
    )
  })
})