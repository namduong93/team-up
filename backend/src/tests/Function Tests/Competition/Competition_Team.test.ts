import { CompetitionIdObject, CompetitionSiteObject } from "../../../models/competition/competition";
import { CompetitionAccessLevel, CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../../../models/competition/competitionUser";
import { University } from "../../../models/university/university";
import { Staff } from "../../../models/user/staff/staff";
import { Student } from "../../../models/user/student/student";
import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Teams Function', () => {
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
    code: 'TC17',
    region: 'Australia'
  }

  const SucessStaff: Staff = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'dasOddodmin16@odmin.com',
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
      email: 'newStudentSacrifice8@gmail.com',
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
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: User has no access to this list', async () => {
    expect(await comp_db.competitionTeams(id + 100, comp.competitionId)).toStrictEqual([])
  })

  test('Sucess case: returns a list of teams in competition', async () => {
    expect(await comp_db.competitionTeams(id, comp.competitionId)).toStrictEqual([
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
        teamLevel: 'No Preference',
        startDate: new Date(startDate),
        students: [{
          "ICPCEligible": true,
          "bio": "I good, promise",
          "boersenEligible": true,
          "codeforcesRating": 7,
          "email": "newStudentSacrifice8@gmail.com",
          "internationalPrizes": "none",
          "isRemote": true,
          "level": "No Preference",
          "name": "Maximillian Maverick",
          "preferredName": "X",
          "sex": "Male",
          "nationalPrizes": "none",
          "pastRegional": true,
          "preferredContact": "Pigeon Carrier",
          "universityCourses": [
            "4511",
            "9911",
            "911",
          ],

          "userId": newStudent.userId,
        }, {
          "ICPCEligible": null,
          "bio": null,
          "boersenEligible": null,
          "codeforcesRating": null,
          "email": null,
          "internationalPrizes": null,
          "isRemote": null,
          "level": null,
          "name": null,
          "nationalPrizes": null,
          "preferredName": null,
          "sex": null,
          "pastRegional": null,
          "preferredContact": null,
          "universityCourses": null,
          "userId": null,
        }, {
          "ICPCEligible": null,
          "bio": null,
          "boersenEligible": null,
          "codeforcesRating": null,
          "email": null,
          "internationalPrizes": null,
          "isRemote": null,
          "level": null,
          "name": null,
          "preferredName": null,
          "sex": null,
          "nationalPrizes": null,
          "pastRegional": null,
          "preferredContact": null,
          "universityCourses": null,
          "userId": null,
        }],
        coach: {
          name: 'Maximillian Maverick',
          email: 'dasOddodmin16@odmin.com',
          bio: 'i good, trust'
        }
      }
    ])
  })
})