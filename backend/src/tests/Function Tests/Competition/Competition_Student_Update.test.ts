import { SiteLocation } from '../../../../shared_types/Competition/CompetitionDetails';
import { CompetitionLevel } from '../../../../shared_types/Competition/CompetitionLevel';
import { CompetitionRole } from '../../../../shared_types/Competition/CompetitionRole';
import { EditCourse } from '../../../../shared_types/Competition/staff/Edit';
import { StaffAccess, StaffInfo } from '../../../../shared_types/Competition/staff/StaffInfo';
import { StudentInfo } from '../../../../shared_types/Competition/student/StudentInfo';
import { CourseCategory } from '../../../../shared_types/University/Course';
import { UserAccess } from '../../../../shared_types/User/User';
import { CompetitionIdObject } from '../../../models/competition/competition';
import { CompetitionUser, CompetitionUserRole } from '../../../models/competition/competitionUser';
import { University } from '../../../models/university/university';
import { Staff } from '../../../models/user/staff/staff';
import { Student } from '../../../models/user/student/student';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbCompetitionStaffRepository } from '../../../repository/competition_staff/SqlDbCompetitionStaffRepository';
import { SqlDbCompetitionStudentRepository } from '../../../repository/competition_student/SqlDbCompetitionStudentRepository';
import { SqlDbUniversityRepository } from '../../../repository/university/SqlDbUniversityRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import { UserIdObject } from '../../../repository/UserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

describe('Student Update Test', () => {
  let user_db;
  let comp_db;
  let uni_db;
  let comp_staff_db;
  let comp_student_db;


  let dateNow = Date.now();
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const userSiteLocation: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    siteId: 1,
    defaultSite: 'TestRoom',
  };

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NEW11',
    region: 'Australia'
  };

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin11@odmin.com',
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
    comp_staff_db = new SqlDbCompetitionStaffRepository(pool, comp_db);
    comp_student_db = new SqlDbCompetitionStudentRepository(pool, comp_db);
    user_db = new SqlDbUserRepository(pool);
    uni_db = new SqlDbUniversityRepository(pool);
    user = await user_db.staffRegister(SucessStaff);
    id = user.userId;
    comp = await comp_staff_db.competitionSystemAdminCreate(id, mockCompetition);

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin11@odmin.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      allergies: null,
      dietaryReqs: '{}',
      accessibilityReqs: null,
      userAccess: UserAccess.Pending,
      bio: 'good bio, trust',
      roles: [CompetitionRole.Admin, CompetitionRole.Coach, CompetitionRole.SiteCoordinator],
      access: StaffAccess.Accepted
    };
    await comp_staff_db.competitionStaffUpdate(id, [newStaffInfo], comp.competitionId);

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newcontender11@gmail.com',
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
    };
    const studentUni: University = {
      id: 1,
      name: 'University of Melbourne'
    };
    await comp_student_db.competitionStudentJoin(newContender, studentUni);
    teamInfo = await comp_student_db.competitionTeamDetails(newStudent.userId, comp.competitionId);
    const newCourses: EditCourse = {
      [CourseCategory.Introduction]: 'COMP1234',
      [CourseCategory.DataStructures]: 'COMP9999',
      [CourseCategory.AlgorithmDesign]: 'COMP7894',
      [CourseCategory.ProgrammingChallenges]: 'COMP9480',
    };
    await comp_staff_db.competitionStaffUpdateCourses(comp.competitionId, newCourses, 1);
  });


  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: succesfully changed the students details', async () => {
    expect(await comp_student_db.competitionStudentDetails(newStudent.userId, comp.competitionId)).toStrictEqual(
      {
        name: 'Maximillian Maverick',
        email: 'newcontender11@gmail.com',
        accessibilityReqs: null,
        allergies: null,
        bio: 'I good, promise',
        isOfficial: null,
        level: 'No Preference',
        preferredContact: 'Pigeon Carrier',
        dietaryReqs: '{}',
        ICPCEligible: true,
        boersenEligible: true,
        degreeYear: 3,
        degree: 'ComSci',
        isRemote: true,
        nationalPrizes: 'none',
        preferredName: 'X',
        pronouns: 'He/Him',
        roles: '{Participant}',
        sex: 'Male',
        status: 'Accepted',
        studentId: 'z5381412',
        tshirtSize: 'L',
        internationalPrizes: 'none',
        codeforcesRating: 7,
        universityCourses: ['4511', '9911', '911'],
        pastRegional: true,
        universityId: 1,
        universityName: 'University of Melbourne',
        userId: newStudent.userId,
      }
    );

    const newStudentInfo: StudentInfo = {
      name: 'Maximillian Maverick',
      email: 'newcontender11@gmail.com',
      accessibilityReqs: null,
      allergies: null,
      isOfficial: null,
      level: CompetitionLevel.LevelA,
      dietaryReqs: '{}',
      ICPCEligible: false,
      preferredName: 'X',
      pronouns: 'He/Him',
      roles: [CompetitionRole.Participant],
      sex: 'Male',
      status: 'Accepted',
      studentId: 'z5381412',
      tshirtSize: 'L',
      universityCourses: ['4511', '9911', '911'],
      pastRegional: true,
      universityId: 1,
      universityName: 'University of Melbourne',
      userId: newStudent.userId,
      bio: 'This was changed',
      boersenEligible: false,
      degreeYear: 2,
      degree: 'Engineering',
      isRemote: false,
      preferredContact: 'Landline and Pigeon Carrier',
      nationalPrizes: 'one',
      internationalPrizes: 'one',
      codeforcesRating: 6
    };

    await comp_staff_db.competitionStudentsUpdate(id, [newStudentInfo], comp.competitionId);

    expect(await comp_student_db.competitionStudentDetails(newStudent.userId, comp.competitionId)).toStrictEqual({
      userId: newStudent.userId,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newcontender11@gmail.com',
      sex: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      dietaryReqs: '{}',
      accessibilityReqs: null,
      allergies: null,
      studentId: 'z5381412',
      roles: '{Participant}',
      bio: 'This was changed',
      ICPCEligible: false,
      boersenEligible: false,
      level: 'Level A',
      degreeYear: 2,
      degree: 'Engineering',
      isRemote: false,
      isOfficial: null,
      preferredContact: 'Landline and Pigeon Carrier',
      nationalPrizes: 'one',
      internationalPrizes: 'one',
      codeforcesRating: 6,
      universityCourses: ['4511', '9911', '911'],
      pastRegional: true,
      status: 'Accepted'
    });
  });
});