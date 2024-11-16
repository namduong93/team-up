import { SiteLocation } from "../../../../shared_types/Competition/CompetitionDetails";
import { CompetitionRole } from "../../../../shared_types/Competition/CompetitionRole";
import { EditCourse } from "../../../../shared_types/Competition/staff/Edit";
import { StaffAccess, StaffInfo } from "../../../../shared_types/Competition/staff/StaffInfo";
import { TeamDetails } from "../../../../shared_types/Competition/team/TeamDetails";
import { TeamStatus } from "../../../../shared_types/Competition/team/TeamStatus";
import { CourseCategory } from "../../../../shared_types/University/Course";
import { UserAccess } from "../../../../shared_types/User/User";
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

describe.skip('Team Update Function', () => {
  let user_db;
  let comp_db;
  let uni_db

  let dateNow = Date.now()
  let startDate = Date.now() + (420 * 1000 * 60 * 60 * 24);
  let earlyDate = Date.now() + (365 * 1000 * 60 * 60 * 24);
  let generalDate = Date.now() + (395 * 1000 * 60 * 60 * 24);

  const userSiteLocation: SiteLocation = {
    universityId: 1,
    universityName: 'University of Melbourne',
    siteId: 1,
    defaultSite: 'TestRoom',
  }

  const mockCompetition = {
    name: 'TestComp',
    teamSize: 5,
    createdDate: dateNow,
    earlyRegDeadline: earlyDate,
    startDate: startDate,
    generalRegDeadline: generalDate,
    siteLocations: [userSiteLocation],
    code: 'NEW13',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'newadmin13@odmin.com',
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

    const newStaffInfo: StaffInfo = {
      userId: id,
      universityId: 1,
      universityName: 'University of Melbourne',
      name: 'Maximillian Maverick',
      email: 'newadmin13@odmin.com',
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
    }
    await comp_db.competitionStaffUpdate(id, [newStaffInfo], comp.competitionId)

    const mockStudent: Student = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'newcontender13@gmail.com',
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

  test('Successful case: Husk', async () => {
    const teamInformation = await comp_db.competitionTeams(id, comp.competitionId);
    expect(teamInformation).toStrictEqual([
      {
        siteId: 1,
        teamId: expect.any(Number),
        universityId: 1,
        status: 'Pending',
        teamNameApproved: true,
        compName: 'TestComp',
        teamName: 'Bulbasaur',
        teamSite: 'Library',
        teamSeat: null,
        teamLevel: 'Level B',
        startDate: new Date(startDate),
        students: [
          {
            userId: newStudent.userId,
            name: 'Maximillian Maverick',
            preferredName: 'X',
            sex: 'Male',
            email: 'newcontender13@gmail.com',
            bio: 'I good, promise',
            preferredContact: 'Pigeon Carrier',
            ICPCEligible: true,
            level: 'No Preference',
            boersenEligible: true,
            isRemote: true,
            universityCourses: ["4511", "9911", "911"],
            nationalPrizes: 'none',
            internationalPrizes: 'none',
            codeforcesRating: 7,
            pastRegional: true
          },
          {
            userId: null,
            name: null,
            preferredName: null,
            sex: null,
            email: null,
            bio: null,
            preferredContact: null,
            ICPCEligible: null,
            level: null,
            boersenEligible: null,
            isRemote: null,
            universityCourses: null,
            nationalPrizes: null,
            internationalPrizes: null,
            codeforcesRating: null,
            pastRegional: null
          },
          {
            userId: null,
            name: null,
            preferredName: null,
            sex: null,
            email: null,
            bio: null,
            preferredContact: null,
            ICPCEligible: null,
            level: null,
            boersenEligible: null,
            isRemote: null,
            universityCourses: null,
            nationalPrizes: null,
            internationalPrizes: null,
            codeforcesRating: null,
            pastRegional: null
          }
        ],
        coach: {
          name: 'Maximillian Maverick',
          email: 'newadmin13@odmin.com',
          bio: 'good bio, trust'
        }
      }
    ])

    const newTeamInfo: TeamDetails = {
      siteId: 2,
      teamId: teamInformation.siteId,
      universityId: 1,
      status: TeamStatus.Pending,
      teamNameApproved: true,
      compName: 'TestComp',
      teamName: 'Cooler Name',
      teamSite: 'Library',
      teamSeat: 'null1',
      teamLevel: 'Level B',
      startDate: new Date(startDate),
      students: [
        {
          userId: newStudent.userId,
          name: 'Maximillian Maverick',
          preferredName: 'X',
          sex: 'Male',
          email: 'newcontender13@gmail.com',
          bio: 'is a lie',
          preferredContact: 'Pigeon Carrier',
          ICPCEligible: false,
          level: 'Level A',
          boersenEligible: false,
          isRemote: false,
          universityCourses: ["4511", "9911", "911"],
          nationalPrizes: 'two',
          internationalPrizes: 'three',
          codeforcesRating: 11,
          pastRegional: false
        },
        {
          userId: null,
          name: null,
          preferredName: null,
          sex: null,
          email: null,
          bio: null,
          preferredContact: null,
          ICPCEligible: null,
          level: null,
          boersenEligible: null,
          isRemote: null,
          universityCourses: null,
          nationalPrizes: null,
          internationalPrizes: null,
          codeforcesRating: null,
          pastRegional: null
        },
        {
          userId: null,
          name: null,
          preferredName: null,
          sex: null,
          email: null,
          bio: null,
          preferredContact: null,
          ICPCEligible: null,
          level: null,
          boersenEligible: null,
          isRemote: null,
          universityCourses: null,
          nationalPrizes: null,
          internationalPrizes: null,
          codeforcesRating: null,
          pastRegional: null
        }
      ],
      coach: {
        name: 'Maximillian Maverick',
        email: 'newadmin13@odmin.com',
        bio: 'good bio, trust'
      }
    }

    await comp_db.competitionTeamsUpdate([newTeamInfo], comp.competitionId);

    console.log(await comp_db.competitionTeams(id, comp.competitionId));
  })
})

