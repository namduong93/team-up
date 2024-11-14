import { CompetitionIdObject, CompetitionSiteObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { University } from "../../../models/university/university";
import { Staff } from "../../../models/user/staff/staff";
import { Student } from "../../../models/user/student/student";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUniversityRepository } from "../../../repository/university/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('Universe Courses Function', () => {
  let user_db;
  let comp_db;
  let uni_db;

  let dateNow = Date.now()
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const mockCompetition = {
    name: 'UniTest',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [{
      universityId: 5,
      name: 'TestRoom',
      capacity: 2000
    }],
    code: 'UT1',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'uniadmin1@odmin.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'M',
    universityId: 5,
  };
  let user: UserIdObject;
  let id: number;
  let comp: CompetitionIdObject;
  let newStudent: UserIdObject;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'UniversitySacrifice1@OwO.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 5,
    studentId: 'z5381412'
  };

  beforeAll(async () => {
    uni_db = new SqlDbUniversityRepository(pool);
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
        id: 5,
        name: 'University of New South Wales'
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

    newStudent = await user_db.studentRegister(mockUser);

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
      id: 5,
      name: 'University of New South Wales'
    }
    await comp_db.competitionStudentJoin(newContender, studentUni)
  });


  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  //need competition add course
  test('Sucess case: returns a list of courses', async () => {
    console.log(await uni_db.universityCourses(newStudent.userId, 'UT1'))
    // expect(await uni_db.universityCourses(user.userId)).toStrictEqual([
    //   {
    //     courseId: 1,
    //     courseName: 'COMP1511 Programming Fundamentals',
    //     category: 'Introduction'
    //   },
    //   {
    //     courseId: 2,
    //     courseName: 'COMP2521 Data Structures and Algorithms',
    //     category: 'Data Structures'
    //   },
    //   {
    //     courseId: 3,
    //     courseName: 'COMP3121 Algorithm Design or COMP 3821 Extended Algorithm Design',
    //     category: 'Algorithm Design'
    //   },
    //   {
    //     courseId: 4,
    //     courseName: 'COMP4128 Programming Challenges',
    //     category: 'Programming Challenges'
    //   }
    // ]);
  })
})