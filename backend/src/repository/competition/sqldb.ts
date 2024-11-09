import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamMateData, UniversityDisplayInfo } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionShortDetailsObject, CompetitionIdObject, CompetitionSiteObject, DEFAULT_COUNTRY, CompetitionWithdrawalReturnObject, CompetitionTeamNameObject } from "../../models/competition/competition.js";

import { UserType } from "../../models/user/user.js";
import { parse } from "postgres-array";
import { AlgoConversion, CompetitionAlgoStudentDetails, CompetitionAlgoTeamDetails, CompetitionStaff, CompetitionStudentDetails, CompetitionUser, CompetitionUserRole } from "../../models/competition/competitionUser.js";
import { DEFAULT_TEAM_SIZE, SeatAssignment, TeamStatus } from "../../models/team/team.js";
import { DbError } from "../../errors/db_error.js";
import { University } from "../../models/university/university.js";
import { CompetitionSite } from "../../../shared_types/Competition/CompetitionSite.js";
import pokemon from 'pokemon';
import { ParticipantTeamDetails, TeamDetails } from "../../../shared_types/Competition/team/TeamDetails.js";
import { StudentInfo } from "../../../shared_types/Competition/student/StudentInfo.js";
import { StaffInfo } from "../../../shared_types/Competition/staff/StaffInfo.js";
import { AttendeesDetails } from "../../../shared_types/Competition/staff/AttendeesDetails.js";
import { CourseCategory } from "../../../shared_types/University/Course.js";
import { error } from "console";

export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  competitionStaffUpdate = async (userId: number, staffList: StaffInfo[], compId: number) => {
    for (const staff of staffList) {
      try {
        await this.pool.query(
          `UPDATE competition_users
          SET
            bio = '${staff.bio}',
            competition_roles = '{${staff.roles}}',
            access_level = '${staff.access}'
            WHERE user_id = ${staff.userId} AND competition_id = ${compId};
          `
        );

      } catch (error: unknown) {
        throw new DbError(DbError.Insert, 'Failed to update a user in the db');
      }
    }

    return;
  }

  competitionStudentsUpdate = async (userId: number, studentList: StudentInfo[], compId: number) => {
    
    for (const student of studentList) {
      try {
        await this.pool.query(
          `UPDATE competition_users
          SET
            bio = '${student.bio}',
            icpc_eligible = ${student.ICPCEligible},
            boersen_eligible = ${student.boersenEligible},
            competition_level = '${student.level}',
            degree_year = ${student.degreeYear},
            degree = '${student.degree}',
            is_remote = ${student.isRemote},
            is_official = ${student.isOfficial},
            preferred_contact = '${student.preferredContact}',
            national_prizes = '${student.nationalPrizes}',
            international_prizes = '${student.internationalPrizes}',
            codeforces_rating = ${student.codeforcesRating}
          WHERE user_id = ${student.userId} AND competition_id = ${compId};
          `
        );

      } catch (error: unknown) {
        throw new DbError(DbError.Insert, 'Failed to update a user in the db');
      }
    }

    return;
  }

  coachCheckIdsStudent = async (userId: number, userIds: Array<number>, compId: number) => {
    const dbResult = await this.pool.query(
      `SELECT cu.user_id AS "userId"
      FROM competition_users AS cu_coach
      JOIN competition_users AS cu ON cu.competition_coach_id = cu_coach.id
      WHERE cu_coach.user_id = ${userId} AND cu_coach.competition_id = ${compId}
      `
    );

    const resultIds = dbResult.rows.map((row) => row.userId);

    if (!userIds.every((id) => resultIds.includes(id))) {
      throw new DbError(DbError.Auth, "Coach is not coaching some of the students in the provided list");
    }
  }

  coachCheckIds = async (userId: number, teamIds: Array<number>, compId: number) => {
    // Check if the coach is coaching all the teams in approveIds
    const coachCheckQuery = `
    SELECT id
    FROM competition_teams
    WHERE id = ANY($1::int[])
    AND competition_id = $2
    AND competition_coach_id = (
      SELECT id FROM competition_users
      WHERE user_id = $3
      AND competition_id = $2
    )
    `;
    const coachCheckResult = await this.pool.query(coachCheckQuery, [teamIds, compId, userId]);
    const resultIds = coachCheckResult.rows.map((row) => row.id);
    
    if (!teamIds.every((id) => resultIds.includes(id))) {
      throw new DbError(DbError.Auth, "Coach is not coaching some of the teams in the provided team IDs.");
    }

    return;
  }

  competitionTeamsUpdate = async (teamList: Array<TeamDetails>, compId: number) => {

    for (const team of teamList) {

      const participantIds = [];

      for (const participant of team.students) {

        try {
          await this.pool.query(
            `UPDATE competition_users
            SET
              bio = '${participant.bio}',
              icpc_eligible = ${participant.ICPCEligible},
              boersen_eligible = ${participant.boersenEligible},
              competition_level = '${participant.level}',
              is_remote = ${participant.isRemote},
              national_prizes = '${participant.nationalPrizes}',
              international_prizes = '${participant.internationalPrizes}',
              codeforces_rating = ${participant.codeforcesRating},
              past_regional = ${participant.pastRegional}
            WHERE user_id = ${participant.userId} AND competition_id = ${compId};
            `
          );
          participantIds.push(participant.userId);

        } catch (error: unknown) {
          throw new DbError(DbError.Insert, 'Failed to update a user in the db');
        }
      }

      await this.pool.query(
        `UPDATE competition_teams
        SET
          name = '${team.teamName}',
          team_seat = '${team.teamSeat}',
          site_attending_id = ${team.siteId},
          participants = '{${participantIds}}'
        WHERE id = ${team.teamId}
        `
      );
    }

    return;
  }
  
  competitionSites = async (compId: number): Promise<CompetitionSite[]> => {
    
    const dbResult = await this.pool.query(
      `SELECT cs.id AS "id", cs.name AS "name"
      FROM competition_sites AS cs
      WHERE cs.competition_id = ${compId}
      `
    );

    return dbResult.rows;
  }

  competitionAttendees = async (userId: number, compId: number): Promise<Array<AttendeesDetails>> => {
    const roles = await this.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT 
          "userId",
          "universityId",
          "universityName",
          "name",
          "preferredName",
          "email",
          "sex",
          "tshirtSize",
          "dietaryNeeds",
          "accessibilityNeeds",
          "allergies",
          "roles",
          "siteId",
          "pendingSiteId",
          "siteName",
          "pendingSiteName",
          "siteCapacity",
          "pendingSiteCapacity"
          FROM competition_attendees AS ca
        WHERE ca.competition_id = $1;`, [compId]
      );
      
      return dbResult.rows.map((row) => ({ ...row, roles: parse(row.roles) }));
    }
  
    if (roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const dbResult = await this.pool.query(
        `SELECT 
          "userId",
          "universityId",
          "universityName",
          "name",
          "preferredName",
          "email",
          "sex",
          "tshirtSize",
          "dietaryNeeds",
          "accessibilityNeeds",
          "allergies",
          "roles",
          "siteId",
          "pendingSiteId",
          "siteName",
          "pendingSiteName",
          "siteCapacity",
          "pendingSiteCapacity"
        FROM competition_attendees AS ca
        WHERE ca.competition_id = $1 AND ca."siteId" = (SELECT site_id FROM competition_users WHERE user_id = $2 AND competition_id = $1 LIMIT 1);`, [compId, userId]
      );

      return dbResult.rows.map((row) => ({ ...row, roles: parse(row.roles) }));
    }
  
    return [];
  }

  competitionTeamDetails = async (userId: number, compId: number): Promise<ParticipantTeamDetails> => {
    const dbResult = await this.pool.query(
      `SELECT "compName", "teamName", "teamSite", "teamSeat",
        "teamLevel", "startDate", students, coach, src_competition_id
      FROM competition_team_details AS ctd
      WHERE ctd.src_user_id = ${userId} AND ctd.src_competition_id = ${compId}
      LIMIT 1;
      `
    );

    const teamDetails: ParticipantTeamDetails = dbResult.rows[0];
    const students = teamDetails.students;
    const currentStudentIndex = students.findIndex((student) => student.userId === userId);
    if (currentStudentIndex < 0) {
      throw new DbError(DbError.Query, 'Could not find the current user in their own team [VERY WEIRD BEHAVIOUR]');
    }
    const currentStudent = students.splice(currentStudentIndex, 1)[0];
    students.unshift(currentStudent);
    return { ...teamDetails, students };
  }

  competitionTeamInviteCode = async (userId: number, compId: number): Promise<string> => {
    const teamQuery = `
      SELECT id FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2
    `;
    const teamResult = await this.pool.query(teamQuery, [userId, compId]);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a participant in any team in this competition.');
    }
    const encryptedTeamId = this.encrypt(teamResult.rows[0].id);
    return encryptedTeamId;
  }

  competitionTeamJoin = async(userId: number, compId: number, teamCode: string, university: University): Promise<CompetitionTeamNameObject> => {
    const teamId = this.decrypt(teamCode);
    const currentTeamQuery = `
      SELECT id, participants, competition_coach_id FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2 AND university_id = $3
    `;
    const currentTeamResult = await this.pool.query(currentTeamQuery, [userId, compId, university.id]);

    const teamQuery = `
      SELECT name, participants, competition_coach_id FROM competition_teams
      WHERE id = $1 AND competition_id = $2 AND university_id = $3
    `;
    const teamResult = await this.pool.query(teamQuery, [teamId, compId, university.id]);
    console.log(teamId, compId, university.id);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Team does not exist or is not part of this competition.');
    }
    if (teamResult.rows[0].participants.includes(userId)) {
      throw new DbError(DbError.Query, 'User is already part of this team.');
    }
    if(teamResult.rows[0].participants.length >= 3) {
      throw new DbError(DbError.Query, 'Team is already full.');
    }
    if (teamResult.rows[0].competition_coach_id !== currentTeamResult.rows[0].competition_coach_id) {
      throw new DbError(DbError.Query, 'User have to be under the same coach to join the team.');
    }

    // Join the new team
    const newParticipants = [...teamResult.rows[0].participants, userId];
    const updateTeamQuery = `
      UPDATE competition_teams
      SET participants = $1, team_size = ${newParticipants.length}, team_status = 'Pending'::competition_team_status
      WHERE id = $2
    `;

    const updateTeamResult = await this.pool.query(updateTeamQuery, [newParticipants, teamId]);
    if (updateTeamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Could not join team.');
    }

    // Leave the current team
    if(currentTeamResult.rows[0].participants.length === 1) {
      const deleteNotiQuery = `
        DELETE FROM notifications
        WHERE team_id = $1 AND competition_id = $2
      `;
      const deleteNotiResult = await this.pool.query(deleteNotiQuery, [currentTeamResult.rows[0].id, compId]);
      
      const leaveTeamQuery = `
      DELETE FROM competition_teams
      WHERE id = $1
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [currentTeamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
    }
    else {
      const leaveTeamQuery = `
      UPDATE competition_teams
      SET participants = $1, team_size = ${currentTeamResult.rows[0].participants.length - 1}, team_status = 'Pending'::competition_team_status
      WHERE id = $2
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [currentTeamResult.rows[0].participants.filter((id) => id !== userId), currentTeamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
    }
    return { teamName: teamResult.rows[0].name };
  }

  competitionStudentDetails = async (userId: number, compId: number): Promise<CompetitionStudentDetails> => {
    const dbResult = await this.pool.query(
      `SELECT u.name, u.email, cu.preferred_contact AS "preferredContact", cu.bio AS "competitionBio",
        cu.competition_level AS "competitionLevel", cu.icpc_eligible AS "ICPCEligible", cu.boersen_eligible AS "boersenEligible",
        cu.degree_year AS "degreeYear", cu.degree, cu.is_remote AS "isRemote", cu.national_prizes AS "nationalPrizes",
        cu.international_prizes AS "internationalPrizes", cu.codeforces_rating AS "codeforcesRating", cu.university_courses AS "universityCourses",
        cu.past_regional AS "pastRegional"
      FROM users u
      JOIN competition_users cu ON u.id = cu.user_id
      WHERE cu.user_id = $1 AND cu.competition_id = $2`,
      [userId, compId]
    );

    if (dbResult.rows.length === 0) {
      throw new DbError(DbError.Query, 'User does not exist or is not a participant in this competition.');
    }

    const result = dbResult.rows[0];

    const studentDetails: CompetitionStudentDetails = {
      name: result.name,
      email: result.email,
      preferredContact: result.preferredContact,
      competitionBio: result.competitionBio,
      competitionLevel: result.competitionLevel,
      ICPCEligible: result.ICPCEligible,
      boersenEligible: result.boersenEligible,
      degreeYear: result.degreeYear,
      degree: result.degree,
      isRemote: result.isRemote,
      nationalPrizes: result.nationalPrizes,
      internationalPrizes: result.internationalPrizes,
      codeforcesRating: result.codeforcesRating,
      universityCourses: result.universityCourses,
      pastRegional: result.pastRegional
    };

    return studentDetails;
  }

  competitionRoles = async (userId: number, compId: number): Promise<Array<CompetitionUserRole>> => {
    const dbResult = await this.pool.query(
      `SELECT cu.competition_roles AS roles
      FROM competition_users AS cu WHERE cu.user_id = ${userId} AND cu.competition_id = ${compId} AND access_level = 'Accepted'::competition_access_enum`
    );
    if (dbResult.rows.length === 0) {
      return [];
    }
    return parse(dbResult.rows[0].roles) as Array<CompetitionUserRole>;
  }
  
  competitionStaff = async (userId: number, compId: number): Promise<StaffInfo[]> => {
    const roles = await this.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_staff(${compId})`
      );

      return dbResult.rows;
    }


    return [];
  }

  competitionStudents = async (userId: number, compId: number): Promise<Array<StudentInfo>> => {
    const roles = await this.competitionRoles(userId, compId);
    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_admin_students(${compId})`
      );
      return dbResult.rows;
    }
    
    if (roles.includes(CompetitionUserRole.COACH)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_coach_students(${userId}, ${compId})`
      );
      return dbResult.rows;
    }

    // Should be changed later when we have a comprehensive error system.
    return [];
  }

  competitionTeams = async (userId: number, compId: number): Promise<Array<TeamDetails>> => {
    const roles = await this.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        WHERE ctd.src_competition_id = ${compId};
        `
      );
      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.COACH)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        WHERE ctd.coach_user_id = ${userId} AND ctd.src_competition_id = ${compId};
        ` 
      );

      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        JOIN competition_users AS csu ON csu.site_id = ctd.src_site_attending_id
        WHERE csu.user_id = ${userId} AND ctd.src_competition_id = ${compId};
        ` 
      );

      return dbResult.rows;
    }
    
    // should be changed when we have a comprehensive error system.
    return [];
  };

  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject> => {
    // Set default team size to 3 if not provided
    const teamSize = competition.teamSize ?? DEFAULT_TEAM_SIZE;

    //Check if the code is already in use
    const codeCheckQuery = `
      SELECT 1
      FROM competitions
      WHERE code = $1
    `;
    const codeCheckResult = await this.pool.query(codeCheckQuery, [competition.code]);
    if (codeCheckResult.rowCount > 0) {
      throw new DbError(DbError.Query, "Competition code is already in use.");
    }
    
    // Insert competition into competitions table
    const competitionQuery =
    `INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, code;
    `;
    
    const competitionValues = [
      competition.name,
      teamSize,
      new Date(competition.createdDate),
      new Date(competition.earlyRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.code,
      new Date(competition.startDate),
      competition.region
    ];
    
    const competitionResult = await this.pool.query(competitionQuery, competitionValues);
    const competitionId = competitionResult.rows[0].id;
    
    await this.pool.query(
      `INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
      VALUES (${userId}, ${competitionId}, ARRAY['Admin']::competition_role_enum[], 'Accepted'::competition_access_enum)`
    );
    
    // for the normal siteLocations that have university Ids:
    competition.siteLocations.forEach(async ({ universityId, name }) => {
      await this.pool.query(
        `INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES (${competitionId}, ${universityId}, '${name}', 0)`
      );
    });

    // handle otherSiteLocations with universityName
    competition.otherSiteLocations?.forEach(async ({ universityName, name }) => {
      // Insert new university and get the universityId
      const insertUniversityResult = await this.pool.query(`
        INSERT INTO universities (name)
        VALUES ($1)
        RETURNING id
      `, [universityName]);

      const universityId = insertUniversityResult.rows[0].id;

      // Insert the new site location with the new universityId
      await this.pool.query(`
        INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES ($1, $2, $3, 0)
      `, [competitionId, universityId, name]);
    });
    
    return { competitionId: competitionId };    
  }

  competitionSystemAdminUpdate = async(userId: number, competition: Competition): Promise<{}> => {
    // Verify if userId is an admin of this competition
    const adminCheckQuery = `
      SELECT 1
      FROM competition_admins
      WHERE staff_id = $1 AND competition_id = $2
    `;

    const adminCheckResult = await this.pool.query(adminCheckQuery, [userId, competition.id]);

    if (adminCheckResult.rowCount === 0) {
      throw new DbError(DbError.Query, "User is not an admin for this competition.");
    }

    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;

    const competitionExistResult = await this.pool.query(competitionExistQuery, [competition.id]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition does not exist.");
    }

    // Update competition details
    const competitionUpdateQuery = `
      UPDATE competitions
      SET name = $1, team_size = $2, created_date = $3, early_reg_deadline = $4, general_reg_deadline = $5, code = $6, start_date = $7, region = $8
      WHERE id = $9;
    `;

    const competitionUpdateValues = [
      competition.name,
      competition.teamSize,
      new Date(competition.createdDate),
      new Date(competition.earlyRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.code,
      new Date(competition.startDate),
      competition.region,
      competition.id
    ];

    await this.pool.query(competitionUpdateQuery, competitionUpdateValues);

    // Skip updating site details if siteLocations is not provided
    if (!competition.siteLocations) {
      return {};
    }

    return {};
  }

  competitionGetDetails = async(competitionId: number): Promise<Competition> => {
    const competitionQuery = `
      SELECT id, name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region
      FROM competitions
      WHERE id = $1
    `;
    const competitionResult = await this.pool.query(competitionQuery, [competitionId]);
    
    // Verify if competition exists
    if (competitionResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition does not exist.");
    }
  
    const competitionData = competitionResult.rows[0];
  
    // Query to get site locations related to the competition
    const siteLocationsQuery = `
      SELECT id, university_id, name, capacity
      FROM competition_sites
      WHERE competition_id = $1
    `;
    const siteLocationsResult = await this.pool.query(siteLocationsQuery, [competitionId]);
  
    const siteLocations: Array<CompetitionSiteObject> = siteLocationsResult.rows.map(row => ({
      id: row.id,
      universityId: row.university_id,
      name: row.name,
      capacity: row.capacity,
    }));
      
    // Constructing the competition object
    const competitionDetails: Competition = {
      id: competitionData.id,
      name: competitionData.name,
      teamSize: competitionData.team_size,
      createdDate: competitionData.created_date,
      earlyRegDeadline: competitionData.early_reg_deadline,
      generalRegDeadline: competitionData.general_reg_deadline,
      startDate: competitionData.start_date,
      code: competitionData.code,
      region: competitionData.region,
      siteLocations: siteLocations,
    };
  
    return competitionDetails;
  }

  // Returns only shortened competition details that are displayed on a dashboard. Sites details are not included.
  // Returns competitions that the user is a part of.
  competitionsList = async(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject>> => {
    const comps = await this.pool.query(
      `SELECT id, name, created_date AS "createdDate", early_reg_deadline AS "earlyRegDeadline",
        general_reg_deadline AS "generalRegDeadline" FROM competition_list(${userId})`
    );
    let competitions: Array<CompetitionShortDetailsObject> = [];
    for (let row of comps.rows) {
      let compId = row.id;
      let compName = row.name;
      let location = DEFAULT_COUNTRY;
      let compDate = row.earlyRegDeadline;
      let compCreatedDate = row.createdDate;
      let roles = await this.competitionRoles(userId, compId);
      competitions.push({ compId, compName, location, compDate, roles, compCreatedDate });
    }

    return competitions;
  }

  competitionUniversityDefaultSite = async(competitionId: number, university: University): Promise<CompetitionSiteObject> => {
    const siteResult = await this.pool.query(
      `SELECT id, name FROM competition_sites
      WHERE competition_id = $1 AND university_id = $2
      LIMIT 1`,
      [competitionId, university.id]
    );

    if (siteResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Site not found.");
    }

    let site = {
      id: siteResult.rows[0].id || 0,
      universityId: university.id,
      name: siteResult.rows[0].name || "Not Found",
    };
    
    return site;
  }

  competitionStudentJoin = async (competitionUserInfo: CompetitionUser, university: University): Promise<{}> => {
    // First insert the user into the competition_users table
    let userId = competitionUserInfo.userId;
    let competitionId = competitionUserInfo.competitionId;
    let competitionRoles = competitionUserInfo.competitionRoles;
    let ICPCEligible = competitionUserInfo.ICPCEligible;
    let competitionLevel = competitionUserInfo.competitionLevel;
    let boersenEligible = competitionUserInfo.boersenEligible || false;
    let degreeYear = competitionUserInfo.degreeYear;
    let degree = competitionUserInfo.degree;
    let isRemote = competitionUserInfo.isRemote;
    let nationalPrizes = competitionUserInfo.nationalPrizes || "";
    let internationalPrizes = competitionUserInfo.internationalPrizes || "";
    let codeforcesRating = competitionUserInfo.codeforcesRating || 0;
    let universityCourses = competitionUserInfo.universityCourses || [];
    let pastRegional = competitionUserInfo.pastRegional || false;
    let competitionBio = competitionUserInfo.competitionBio || "";
    let preferredContact = competitionUserInfo.preferredContact || "";

    const coachUserIdResult = await this.pool.query(
      `SELECT "userId" 
       FROM competition_staff($1) 
       WHERE roles::jsonb @> '["Coach"]'::jsonb 
         AND "universityName" = $2`, 
      [competitionId, university.name]
    );
    
    if (coachUserIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Your university is not registered for this competition.");
    }
    const competitionCoachIdResult = await this.pool.query(`
      SELECT id FROM competition_users WHERE user_id = $1 AND competition_id = $2
    `, [coachUserIdResult.rows[0].userId, competitionId]);
    const competitionCoachId = competitionCoachIdResult.rows[0].id;

    const competitionJoinQuery = `
      INSERT INTO competition_users (user_id, competition_id, competition_roles, icpc_eligible, competition_level, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses, past_regional, bio, preferred_contact, competition_coach_id, access_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'Accepted'::competition_access_enum)
      RETURNING id
    `;
    const competitionJoinValues = [
      userId,
      competitionId,
      competitionRoles,
      ICPCEligible,
      competitionLevel,
      boersenEligible,
      degreeYear,
      degree,
      isRemote,
      nationalPrizes,
      internationalPrizes,
      codeforcesRating,
      universityCourses,
      pastRegional,
      competitionBio,
      preferredContact,
      competitionCoachId,
    ];
    
    // Insert user into competition_users table and get competition_user_id
    const result = await this.pool.query(competitionJoinQuery, competitionJoinValues);
    const competitionUserId = result.rows[0].id;

    // Insert user to competition_teams table
    let numberOfTeamsQuery = `
      SELECT COUNT(*) FROM competition_teams
      WHERE competition_id = $1
    `;
    let numberOfTeamsResult = await this.pool.query(numberOfTeamsQuery, [competitionId]);
    let numberOfTeams = parseInt(numberOfTeamsResult.rows[0].count);
    let teamName = `${pokemon.getName((numberOfTeams + 1) % 1000)}`;
    let teamStatus = TeamStatus.PENDING;
    let teamSize = 1;
    let participants = [userId];
    let siteId = competitionUserInfo.siteLocation.id;

    let teamQuery = `
      INSERT INTO competition_teams (name, team_status, team_size, participants, university_id, competition_id, competition_coach_id, site_attending_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const teamNameValues = [
      teamName,
      teamStatus,
      teamSize,
      participants,
      university.id,  
      competitionId,
      competitionCoachId,
      siteId
    ];

    // Insert the team into competition_teams table
    let checkId = await this.pool.query(teamQuery, teamNameValues);
    return {};
  }

  competitionStudentJoin1 = async (sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject> => {

    return { teamId: 1 };
  }

  competitionStudentWithdraw = async (userId: number, compId: number): Promise<CompetitionWithdrawalReturnObject> => {
    // Check if the competition exists
    const competitionExistQuery = `
      SELECT code, name FROM competitions WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);
    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition does not exist.');
    }
    const competitionCode = competitionExistResult.rows[0].code;
    const competitionName = competitionExistResult.rows[0].name;

    const teamQuery = `
      SELECT * FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2
    `;
    const teamResult = await this.pool.query(teamQuery, [userId, compId]);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a participant in any team in this competition.');
    }

    if(teamResult.rows[0].participants.length === 1) {
      //Delete notifications for the team
      const deleteNotificationsQuery = `
        DELETE FROM notifications
        WHERE team_id = $1
      `;
      await this.pool.query(deleteNotificationsQuery, [teamResult.rows[0].id]);
      //Delete the team
      const leaveTeamQuery = `
        DELETE FROM competition_teams
        WHERE id = $1
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [teamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
      //Delete the user from the competition
      const competitionRemoveParticipantQuery = `
        DELETE FROM competition_users
        WHERE user_id = $1
        AND competition_id = $2
      `;
      await this.pool.query(competitionRemoveParticipantQuery, [userId, compId]);
      return { competitionCode, competitionName, teamId: teamResult.rows[0].id, teamName: teamResult.rows[0].name  };
    }
    else {
      // Leave the team
      const leaveTeamQuery = `
        UPDATE competition_teams
        SET participants = $1, team_size = ${teamResult.rows[0].participants.length - 1}, team_status = 'Pending'::competition_team_status
        WHERE id = $2
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [teamResult.rows[0].participants.filter((id) => id !== userId), teamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
      // Join a new team
      const newTeamJoinQuery = `
        INSERT INTO competition_teams (name, team_status, team_size, participants, university_id, competition_id, competition_coach_id, site_attending_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name
      `;
      const newTeamJoinValues = [
        `${pokemon.getName((teamResult.rows[0].id + 1) % 1000)}`,
        TeamStatus.PENDING,
        1,
        [userId],
        teamResult.rows[0].university_id,
        compId,
        teamResult.rows[0].competition_coach_id,
        teamResult.rows[0].site_attending_id
      ];
      const newTeamJoinResult = await this.pool.query(newTeamJoinQuery, newTeamJoinValues);
      return { competitionCode, competitionName, teamId: newTeamJoinResult.rows[0].id, teamName: newTeamJoinResult.rows[0].name };
    }
  }

  competitionApproveTeamAssignment = async(userId: number, compId: number, approveIds: Array<number>): Promise<{}> => {
    // No team to approve
    if (approveIds.length < 1) {
      throw new DbError(DbError.Query, "No team to approve.");
    }
    
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition not found.");
    }

    // Check if any of the ids in approveIds has team_status as 'Registered'
    const registeredTeamsQuery = `
      SELECT id
      FROM competition_teams
      WHERE id = ANY($1::int[]) 
      AND competition_id = $2 
      AND team_status = 'Registered'::competition_team_status
    `;
    const registeredTeamsResult = await this.pool.query(registeredTeamsQuery, [approveIds, compId]);

    if (registeredTeamsResult.rowCount > 0) {
      throw new DbError(DbError.Query, "One or more teams are already registered into ICPC system.");
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, "User is not a coach or an admin for this competition.");
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }

    const approveQuery = `
      UPDATE competition_teams
      SET team_status = 'Unregistered'::competition_team_status
      WHERE id = ANY($1::int[])
      AND competition_id = $2
    `;
    const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

    // If no rows were updated, it implies that no matching records were found
    if (approveResult.rowCount === 0) {
      throw new DbError(DbError.Query, "No matching teams found for the provided approved IDs in this competition.");
    }

    return {};
  }

  competitionRequestTeamNameChange = async(userId: number, compId: number, newTeamName: string): Promise<number> => {
    // Check if the user is a valid member of this team
    const teamMemberCheckQuery = `
      SELECT name, pending_name
      FROM competition_teams
      WHERE competition_id = $1 AND $2 = ANY(participants)
    `;
    const teamMemberCheckResult = await this.pool.query(teamMemberCheckQuery, [compId, userId]);

    if (teamMemberCheckResult.rowCount === 0) {
      throw new DbError(DbError.Query, "User is not a member of this team.");
    }

    if (teamMemberCheckResult.rows[0].name === newTeamName || teamMemberCheckResult.rows[0].pending_name === newTeamName) {
      throw new DbError(DbError.Query, "New team name is similar to the old name or an already requested new name.");
    }

    // Update the pending name in the competition teams table
    const teamNameUpdateQuery = `
      UPDATE competition_teams
      SET pending_name = $3
      WHERE competition_id = $1 AND $2 = ANY(participants)
      RETURNING id
    `;
    const result = await this.pool.query(teamNameUpdateQuery, [compId, userId, newTeamName]);
    const teamId = result.rows[0].id;

    if (result.rowCount === 0) {
      throw new DbError(DbError.Query, "No matching team found for the provided ID in this competition.");
    }

    return teamId;
  }

  competitionApproveTeamNameChange = async(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition not found.");
    }

    // Verify if there are duplicate IDs in the approveIds and rejectIds arrays
    const duplicateIds = approveIds.filter(id => rejectIds.includes(id));
    if (duplicateIds.length > 0) {
      throw new DbError(DbError.Query, "Duplicate team IDs found in team name approve and reject lists.");
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, "User is not a coach or an admin for this competition.");
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }
    
    // Update the team name if the name change is approved
    if (approveIds.length > 0) {
      const approveQuery = `
        UPDATE competition_teams
        SET name = pending_name, pending_name = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

      // If no rows were updated, it implies that no matching records were found
      if (approveResult.rowCount === 0) {
        throw new DbError(DbError.Query, "No matching teams found for the provided approved IDs in this competition.");
      }
    }
    
    // If there are rejected team IDs, batch update to clear pending_name only
    if (rejectIds.length > 0) {
      const rejectQuery = `
        UPDATE competition_teams
        SET pending_name = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const rejectResult = await this.pool.query(rejectQuery, [rejectIds, compId]);

      if (rejectResult.rowCount === 0) {
        throw new DbError(DbError.Insert, "No matching teams found for the provided rejected IDs in this competition.");
      }
    }

    return {};
  }

  competitionRequestSiteChange = async(userId: number, compId: number, newSiteId: number): Promise<number> => {
    // Check if the user is a valid member of a team in this competition
    const teamMemberCheckQuery = `
      SELECT ct.site_attending_id, ct.pending_site_attending_id
      FROM competition_teams AS ct
      WHERE ct.competition_id = $1 AND $2 = ANY(ct.participants)
    `;
    const teamMemberCheckResult = await this.pool.query(teamMemberCheckQuery, [compId, userId]);
  
    if (teamMemberCheckResult.rowCount === 0) {
      throw new DbError(DbError.Query, "User is not a member of any team in this competition.");
    }
  
    const currentSiteId = teamMemberCheckResult.rows[0].site_attending_id;
    const pendingSiteId = teamMemberCheckResult.rows[0].pending_site_attending_id;
  
    if (currentSiteId === newSiteId || pendingSiteId === newSiteId) {
      throw new DbError(DbError.Query, "New site ID is similar to the current site ID or an already requested new site ID.");
    }
  
    // Update the pending site ID in the competition teams table
    const siteIdUpdateQuery = `
      UPDATE competition_teams
      SET pending_site_attending_id = $3
      WHERE competition_id = $1 AND $2 = ANY(participants)
      RETURNING id
    `;
    const result = await this.pool.query(siteIdUpdateQuery, [compId, userId, newSiteId]);
    
    if (result.rowCount === 0) {
      throw new DbError(DbError.Query, "No matching team found for the provided ID in this competition.");
    }
  
    return result.rows[0].id; // Return the team ID
  }

  competitionApproveSiteChange = async(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition not found.");
    }

    // Verify if there are duplicate IDs in the approveIds and rejectIds arrays
    const duplicateIds = approveIds.filter(id => rejectIds.includes(id));
    if (duplicateIds.length > 0) {
      throw new DbError(DbError.Query, "Duplicate team IDs found in site ID approve and reject lists.");
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, "User is not a coach or an admin for this competition.");
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }

    // Update the site ID if the change is approved
    if (approveIds.length > 0) {
      const approveQuery = `
        UPDATE competition_teams
        SET site_attending_id = pending_site_attending_id, pending_site_attending_id = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

      // If no rows were updated, it implies that no matching records were found
      if (approveResult.rowCount === 0) {
        throw new DbError(DbError.Query, "No matching teams found for the provided approved IDs in this competition.");
      }
    } 

    // If there are rejected team IDs, batch update to clear pending_site_attending_id only
    if (rejectIds.length > 0) {
      const rejectQuery = `
        UPDATE competition_teams
        SET pending_site_attending_id = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const rejectResult = await this.pool.query(rejectQuery, [rejectIds, compId]);

      if (rejectResult.rowCount === 0) {
        throw new DbError(DbError.Insert, "No matching teams found for the provided rejected IDs in this competition.");
      }
    }

    return {};
  }

  competitionTeamSeatAssignments = async(userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition not found.");
    }

    // Check if the user is an admin or a site coordinator of this competition.
    // If the user is a site-coordinator, they can only manage seats in the sites they oversee.
    const userRoles = await this.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      throw new DbError(DbError.Auth, "User is not a site coordinator or an admin for this competition.");
    }

    if (userRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const siteIds = seatAssignments.map(assignment => assignment.siteId);
      const siteCoordinatorCheckQuery = `
        SELECT site_id
        FROM competition_users
        WHERE user_id = $1 AND competition_id = $2 AND site_id = ANY($3::int[]) AND competition_roles @> ARRAY['Site-Coordinator']::competition_role_enum[]
      `;
      const siteCoordinatorCheckResult = await this.pool.query(siteCoordinatorCheckQuery, [userId, compId, siteIds]);

      if (siteCoordinatorCheckResult.rowCount !== siteIds.length) {
        throw new DbError(DbError.Auth, "User is not a site coordinator for all the provided sites.");
      }
    }

    for (const assignment of seatAssignments) {
      const { siteId, teamSite, teamSeat, teamId } = assignment;

      // Update the team_seat with teamSeat
      const updateSeatQuery = `
        UPDATE competition_teams
        SET team_seat = $1
        WHERE id = $2 AND site_attending_id = $3
        RETURNING id
      `;
      const updateSeatResult = await this.pool.query(updateSeatQuery, [teamSeat, teamId, siteId]);

      // If no rows were updated, it implies that no matching records with the siteId and teamId were found
      if (updateSeatResult.rowCount === 0) {
        throw new DbError(DbError.Query, `No team with id ${teamId} is found, or invalid team site ${teamSite} with siteId ${siteId} for this team.`);
      }
    }

    return {};
  }

  competitionStaffJoin = async (competitionId: number, staffCompetitionInfo: CompetitionStaff): Promise<{}> => {
    console.log(staffCompetitionInfo);
    const userId = staffCompetitionInfo.userId;
    const roles = staffCompetitionInfo.competitionRoles;
    const competitionExistRole = await this.competitionRoles(userId, competitionId);

    // Admin staff
    if(roles.includes(CompetitionUserRole.ADMIN)) {
      if(competitionExistRole.includes(CompetitionUserRole.ADMIN)) {
        throw new DbError(DbError.Query, "User is already an admin for this competition.");
      }

      const addAdminQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
        VALUES ($1, $2, $3, 'Pending'::competition_access_enum)
      `;

      await this.pool.query(addAdminQuery, [userId, competitionId, [CompetitionUserRole.ADMIN]]);
    }

    // Coach staff
    if(roles.includes(CompetitionUserRole.COACH)) {
      const competitionBio = staffCompetitionInfo.competitionBio;
      if(competitionExistRole.includes(CompetitionUserRole.COACH)) {
        throw new DbError(DbError.Query, "User is already a coach for this competition.");
      }

      const addCoachQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, bio, access_level)
        VALUES ($1, $2, $3, $4, 'Pending'::competition_access_enum)
      `;

      await this.pool.query(addCoachQuery, [userId, competitionId, [CompetitionUserRole.COACH], competitionBio]);
    }

    // Site coordinator staff
    if(roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const siteId = staffCompetitionInfo.siteLocation.id;
      if(competitionExistRole.includes(CompetitionUserRole.SITE_COORDINATOR)) {
        throw new DbError(DbError.Query, "User is already a site coordinator for this competition.");
      }

      const addSiteCoordinatorQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
        VALUES ($1, $2, $3, $4, 'Pending'::competition_access_enum)
      `;

      await this.pool.query(addSiteCoordinatorQuery, [userId, competitionId, [CompetitionUserRole.SITE_COORDINATOR], siteId]);
    }

    return {};
  }

  competitionUniversitiesList = async (competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined> => {

    return [{ id: 1, name: 'Macquarie University' }]
  }

  competitionAlgorithm = async(compId: number, userId: number): Promise<{} | undefined> => {
    const competitionCoachId = await this.competitionCoachIdFromCompId(compId, userId);
    
    const teamsQuery = `
      SELECT id, name, pending_name, team_size, participants, university_id, team_seat, site_attending_id, competition_id, competition_coach_id, team_status
      FROM competition_teams
      WHERE competition_id = $1 AND competition_coach_id = $2 AND team_status = 'Pending'::competition_team_status
    `;
    const teamsResult = await this.pool.query(teamsQuery, [compId, competitionCoachId]);
    if (teamsResult.rowCount === 0) {
      return;
    }
    let userIds = [];
    let convertUserIdToCompUserId = new Map<number, number>();
    for (let team of teamsResult.rows) {
      for(let participant of team.participants) {
        userIds.push(participant);
      }
    }
    
    const sudentsQuery = `
      SELECT id, user_id, preferred_contact, competition_level, icpc_eligible, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses, past_regional
      FROM competition_users
      WHERE user_id = ANY($1::int[]) AND competition_id = $2
    `;
    const studentsResult = await this.pool.query(sudentsQuery, [userIds, compId]);
    let studentMap = new Map<number, CompetitionAlgoStudentDetails>();
    
    for (let student of studentsResult.rows) {
      let algoStudent : CompetitionAlgoStudentDetails = {
        id: student.id,
        userId: student.user_id,
        preferred_contact: student.preferred_contact,
        competitionLevel: student.competition_level,
        ICPCEligible: student.icpc_eligible,
        boersenEligible: student.boersen_eligible,
        degreeYear: student.degree_year,
        degree: student.degree,
        isRemote: student.is_remote,
        nationalPrizes: student.national_prizes,
        internationalPrizes: student.international_prizes,
        codeforcesRating: student.codeforces_rating,
        universityCourses: student.university_courses,
        pastRegional: student.past_regional,
        algoPoint: 0
      };
      convertUserIdToCompUserId.set(algoStudent.userId, algoStudent.id);
      studentMap.set(student.id, algoStudent);
    }
    this.heuristicStudent(studentMap);
    let algoTeams : CompetitionAlgoTeamDetails[] = [];
    for (let team of teamsResult.rows) {
      let teamDetails : CompetitionAlgoTeamDetails = {
        id: team.id,
        name: team.name,
        pendingName: team.pending_name,
        teamSize: team.team_size,
        participants: [],
        universityId: team.university_id,
        teamSeat: team.team_seat,
        siteAttendingId: team.site_attending_id,
        competitionId: team.competition_id,
        competitionCoachId: team.competition_coach_id,
        teamStatus: team.team_status,
      };
      
      for (let participant of team.participants) {
        teamDetails.participants.push(studentMap.get(convertUserIdToCompUserId.get(participant)));
      }
      algoTeams.push(teamDetails);
    }

    let sortedAlgoTeams = this.sortTeams(algoTeams, studentMap);
    let deletedTeams = new Set<number>();
    this.formTeams(sortedAlgoTeams, deletedTeams);
    
    const teamUpdateQuery = `
    UPDATE competition_teams
    SET 
        team_size = subquery.team_size,
        participants = subquery.participants
    FROM jsonb_to_recordset($1::jsonb) AS subquery(
        id INT,
        team_size INT,
        participants INT[]
    )
    WHERE competition_teams.id = subquery.id
    AND competition_teams.competition_id = $2
    `;

    // Prepare the data
    const updateData = algoTeams.map(team => ({
        id: team.id,
        team_size: team.participants.length,
        participants: team.participants.map(p => p.userId)
    }));

    await this.pool.query(teamUpdateQuery, [JSON.stringify(updateData), compId]);

    // Delete notifications for the deleted teams
    const deleteNotificationsQuery = `
      DELETE FROM notifications
      WHERE team_id = ANY($1::int[]) 
      AND competition_id = $2
    `
    const deleteNotiResult = await this.pool.query(deleteNotificationsQuery, [Array.from(deletedTeams), compId]);
    await this.pool.query(deleteNotificationsQuery, [Array.from(deletedTeams), compId]);

    // Delete the deleted teams
    const deleteTeamsQuery = `
    DELETE FROM competition_teams
    WHERE id = ANY($1::int[])
    AND competition_id = $2
    `;
    const deletedTeamsArray = Array.from(deletedTeams);
    await this.pool.query(deleteTeamsQuery, [deletedTeamsArray, compId]);

    // This is for demo only
    return {
      algorithm: {
        teamsParticipating: algoTeams.map(team => ({
          id: team.id,
          name: team.name,
          participants: team.participants.map(p => p.userId),
          algoPoint: Math.max(...team.participants.map(p => studentMap.get(p.id)?.algoPoint || 0))
        }))
      }
    };
  }

  // Calculate point for each participant
  heuristicStudent = (students:  Map<number, CompetitionAlgoStudentDetails>) => {
    for(let student of students.values()) {
      if(student.codeforcesRating) {
        student.algoPoint = Math.max(student.algoPoint, student.codeforcesRating);
      }
      if(student.universityCourses.includes(CourseCategory.Introduction)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.INTRO_COURSE);
      }
      if(student.universityCourses.includes(CourseCategory.DataStructures)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.DSA_COURSE);
      }
      if(student.universityCourses.includes(CourseCategory.AlgorithmDesign)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.ADVANCED_COURSE);
      }
      if(student.universityCourses.includes(CourseCategory.ProgrammingChallenges)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.CHALLENGE_COURSE);
      }
      if(student.nationalPrizes) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.NATIONAL_PRIZE);
      }
      if(student.pastRegional) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.PAST_REGIONAL);
      }
      if(student.internationalPrizes) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.INTERNATION_PRIZE);
      }
    }
  }

  formTeams = (teams: CompetitionAlgoTeamDetails[], deletedTeams: Set<number>) => {
    for(let i = 0; i < teams.length; i++) {
      if(deletedTeams.has(teams[i].id)) {
        continue;
      }
      if(teams[i].teamSize === 3) {
        continue;
      }
      if(teams[i].teamSize === 2) {
        for(let j = i + 1; j < teams.length; j++) {
          if(deletedTeams.has(teams[j].id)) {
            continue;
          }
          if(teams[j].participants.length === 1) {
            teams[i].participants.push(teams[j].participants[0]);
            teams[i].teamSize += 1;
            deletedTeams.add(teams[j].id);
            break;
          }
        }
      }
      else {
        let singleTeam = 0;
        for(let j = i + 1; j < teams.length; j++) {
          if(deletedTeams.has(teams[j].id)) {
            continue;
          }
          if(teams[j].teamSize === 1) {
            if(singleTeam === 0) {
              singleTeam = j;
            }
            else {
              teams[i].participants.push(teams[singleTeam].participants[0]);
              teams[i].participants.push(teams[j].participants[0]);
              teams[i].teamSize += 2;
              deletedTeams.add(teams[singleTeam].id);
              deletedTeams.add(teams[j].id);
              break;
            }
          }
          else {
            teams[i].participants.push(teams[j].participants[0]);
            teams[i].participants.push(teams[j].participants[1]);
            teams[i].teamSize += 2;
            deletedTeams.add(teams[j].id);
            break;
          }
          if(j === teams.length - 1) {
            teams[i].participants.push(teams[singleTeam].participants[0]);
            teams[i].teamSize += 1;
            deletedTeams.add(teams[singleTeam].id);
          }
        }
      }
    }
  }

  sortTeams = (teams: CompetitionAlgoTeamDetails[], studentMap: Map<number, CompetitionAlgoStudentDetails>) => {  
    teams.sort((teamA, teamB) => {
      const teamAMaxPoint = Math.max(...teamA.participants.map(p => 
          studentMap.get(p.id)?.algoPoint || 0
      ));
      const teamBMaxPoint = Math.max(...teamB.participants.map(p => 
          studentMap.get(p.id)?.algoPoint || 0
      ));
      
      // Sort in descending order (higher points first)
      return teamBMaxPoint - teamAMaxPoint;
    });
    return teams;
  }

  competitionCoachIdFromCompId = async (compId: number, userId: number): Promise<number | undefined> => {
    const competitionCoachIdQuery = `
      SELECT id
      FROM competition_users
      WHERE user_id = $1 AND competition_id = $2
    `;
    const competitionCoachIdResult = await this.pool.query(competitionCoachIdQuery, [userId, compId]);
    if (competitionCoachIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, "User is not a coach for this competition.");
    }
    return competitionCoachIdResult.rows[0].id;
  }

  competitionIdFromCode = async (code: string): Promise<number> => {
    const competitionIdQuery = `SELECT id FROM competitions WHERE code = $1 LIMIT 1`;
    const competitionIdResult = await this.pool.query(competitionIdQuery, [code]);
    if (competitionIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, "Competition not found.");
    }

    return competitionIdResult.rows[0].id;
  }

  // Helper function to add competition ids to map
  private addCompetitionIdsToMap = (rows: any[], competitionMap: Map<number, { userType: Array<CompetitionUserRole>, competition: Competition }>, userType: CompetitionUserRole) => {
    rows.forEach(row => {
      if (!competitionMap.has(row.id)) {
        competitionMap.set(row.id, { userType: [userType], competition: row });
      } else {
        competitionMap.get(row.id)?.userType.push(userType);
      }
    });
  }

  SALTED_TEAM_CODE = 12345;
  encrypt = (id: number) => {
    const text = String(id + this.SALTED_TEAM_CODE);
    return Buffer.from(text).toString('base64').substring(0, 8);
  };

  decrypt = (encoded: string) => {
    const text = Buffer.from(encoded, 'base64').toString('utf-8');
    const id = parseInt(text) - this.SALTED_TEAM_CODE;
    return id;
  };
}
