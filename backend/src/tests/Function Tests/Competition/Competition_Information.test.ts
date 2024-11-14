import { EditCourse } from "../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../shared_types/University/Course";
import { CompetitionIdObject, CompetitionSiteObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { University } from "../../../models/university/university";
import { Staff } from "../../../models/user/staff/staff";
import { Student } from "../../../models/user/student/student";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUniversityRepository } from "../../../repository/university/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Template tests', () => {
  let user_db;
  let comp_db;
  let uni_db

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
    code: 'NEW3',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin3@odmin.com',
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
  let teamInfo;

  beforeAll(async () => {
    comp_db = new SqlDbCompetitionRepository(pool);
    user_db = new SqlDbUserRepository(pool);
    uni_db = new SqlDbUniversityRepository(pool);
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
      email: 'newcontender3@gmail.com',
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
    teamInfo = await comp_db.competitionTeamDetails(newStudent.userId, comp.competitionId);
    const newCourses: EditCourse = {
      [CourseCategory.Introduction]: 'COMP1234',
      [CourseCategory.DataStructures]: 'COMP9999',
      [CourseCategory.AlgorithmDesign]: 'COMP7894',
      [CourseCategory.ProgrammingChallenges]: 'COMP9480',
    }
    await comp_db.competitionStaffUpdateCourses(comp.competitionId, newCourses, 1)
  });


  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: return competition information', async () => {
    expect(await comp_db.competitionInformation(comp.competitionId)).toStrictEqual({
      information: null,
      name: 'TestComp',
      region: 'Australia',
      startDate: new Date(startDate),
      earlyRegDeadline: new Date(earlyDate),
      generalRegDeadline: new Date(generalDate),
      code: 'NEW3',
      siteLocations: [
        {
          universityId: 1,
          universityName: 'University of Melbourne',
          siteId: 10,
          defaultSite: 'undefined'
        }
      ]
    })
  })
})