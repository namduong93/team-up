import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, StudentInfo, TeamIdObject, TeamDetails, TeamMateData, UniversityDisplayInfo, StaffInfo, ParticipantTeamDetails } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionShortDetailsObject, CompetitionIdObject, CompetitionSiteObject, DEFAULT_COUNTRY, CompetitionWithdrawalReturnObject } from "../../models/competition/competition.js";

import { UserType } from "../../models/user/user.js";
import { parse } from "postgres-array";
import { CompetitionUser, CompetitionUserRole } from "../../models/competition/competitionUser.js";
import { DEFAULT_TEAM_SIZE, TeamStatus } from "../../models/team/team.js";
import { DbError } from "../../errors/db_error.js";

export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  competitionTeamDetails = async (userId: number, compId: number): Promise<ParticipantTeamDetails> => {
    const dbResult = await this.pool.query(
      `SELECT "compName", "teamName", "teamSite", "teamSeat",
        "teamLevel", "startDate", students, coach
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

  competitionRoles = async (userId: number, compId: number): Promise<Array<CompetitionUserRole>> => {
    const dbResult = await this.pool.query(
      `SELECT cu.competition_roles AS roles
      FROM competition_users AS cu WHERE cu.user_id = ${userId} AND cu.competition_id = ${compId}`
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
          "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
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
          "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        WHERE ctd.coach_user_id = ${userId} AND ctd.src_competition_id = ${compId};
        ` 
      );
      console.log("herer", dbResult.rows);

      return dbResult.rows;
    }
    
    // should be changed when we have a comprehensive error system.
    return [];
  };

  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject | undefined> => {
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
      return undefined; // TODO: throw unique error
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
      `INSERT INTO competition_users (user_id, competition_id, competition_roles)
      VALUES (${userId}, ${competitionId}, ARRAY['Admin']::competition_role_enum[])`
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

  competitionSystemAdminUpdate = async(userId: number, competition: Competition): Promise<{} | undefined> => {
    // Verify if userId is an admin of this competition
    const adminCheckQuery = `
      SELECT 1
      FROM competition_admins
      WHERE staff_id = $1 AND competition_id = $2
    `;

    const adminCheckResult = await this.pool.query(adminCheckQuery, [userId, competition.id]);

    if (adminCheckResult.rowCount === 0) {
      return undefined; // TODO: throw unique error
    }

    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;

    const competitionExistResult = await this.pool.query(competitionExistQuery, [competition.id]);

    if (competitionExistResult.rowCount === 0) {
      return undefined; // TODO: throw unique error
    }

    // TODO: Handle prefilling empty fields with old info. This might have been done on the FE but we should handle it here as well
    
    // Update competition details
    const competitionUpdateQuery = `
      UPDATE competitions
      SET name = $1, team_size = $2, created_date = $3, early_reg_deadline = $4, general_reg_deadline = $5
      WHERE id = $6;
    `;

    const competitionUpdateValues = [
      competition.name,
      competition.teamSize,
      new Date(competition.createdDate),
      new Date(competition.earlyRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.id
    ];

    await this.pool.query(competitionUpdateQuery, competitionUpdateValues);

    // Skip updating site details if siteLocations is not provided
    if (!competition.siteLocations) {
      return {};
    }

    // TODO: handle site updates

    return {};
  }

  competitionGetDetails = async(competitionId: number): Promise<Competition | undefined> => {
    const competitionQuery = `
      SELECT id, name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region
      FROM competitions
      WHERE id = $1
    `;
    const competitionResult = await this.pool.query(competitionQuery, [competitionId]);
    
    // Verify if competition exists
    if (competitionResult.rowCount === 0) {
      return undefined; // TODO: throw unique error
    }
  
    const competitionData = competitionResult.rows[0];
  
    // Query to get site locations related to the competition
    const siteLocationsQuery = `
      SELECT university_id, name, capacity
      FROM competition_sites
      WHERE competition_id = $1
    `;
    const siteLocationsResult = await this.pool.query(siteLocationsQuery, [competitionId]);
  
    const siteLocations: Array<CompetitionSiteObject> = siteLocationsResult.rows.map(row => ({
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
  competitionsList = async(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject> | undefined> => {
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

  competitionStudentJoin = async (competitionUserInfo: CompetitionUser): Promise<{} | undefined> => {
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

    const competitionJoinQuery = `
      INSERT INTO competition_users (user_id, competition_id, competition_roles, icpc_eligible, competition_level, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses, past_regional)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
      pastRegional
    ];
    
    // Insert user into competition_users table and get competition_user_id
    const result = await this.pool.query(competitionJoinQuery, competitionJoinValues);
    const competitionUserId = result.rows[0].id;

    // Retrieve university_id from the users table
    const universityQuery = `
      SELECT university_id FROM users WHERE id = $1
    `;
    const universityResult = await this.pool.query(universityQuery, [userId]);
    const universityId = universityResult.rows[0].university_id;

    // Generate the team name (e.g., "Team#ID") and insert into competition_teams
    let teamStatus = TeamStatus.PENDING;
    let teamSize = DEFAULT_TEAM_SIZE;
    let participants = [userId];

    let teamNameQuery = `
      INSERT INTO competition_teams (name, team_status, team_size, participants, university_id, competition_id)
      VALUES (CONCAT('Team#', currval(pg_get_serial_sequence('competition_teams', 'id'))), $1, $2, $3, $4, $5)
      RETURNING id
    `;
    const teamNameValues = [
      teamStatus,
      teamSize,
      participants,
      universityId,  // university_id from users table
      competitionId
    ];

    // Insert the team into competition_teams table
    let checkId = await this.pool.query(teamNameQuery, teamNameValues);
    return {};
  }

  competitionStudentJoin1 = async (sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined> => {

    return { teamId: 1 };
  }

  competitionStudentWithdraw = async (userId: number, compId: number): Promise<CompetitionWithdrawalReturnObject | undefined> => {
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

    const teamRemoveMemberQuery = `
      UPDATE competition_teams
      SET participants = array_remove(participants, $1)
      WHERE $1 = ANY(participants) AND competition_id = $2
      RETURNING id, name
    `;
    const teamRemoveMemberResult = await this.pool.query(teamRemoveMemberQuery, [userId, compId]);
    if (teamRemoveMemberResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a participant in any team in this competition.');; // TODO: throw error that user is not in a team in this competition
    }
    const teamId = teamRemoveMemberResult.rows[0]?.id;
    const teamName = teamRemoveMemberResult.rows[0]?.name;

    const teamSetPendingQuery = `
      UPDATE competition_teams
      SET team_status = 'Pending'::competition_team_status
      WHERE id = $1
    `;
    await this.pool.query(teamSetPendingQuery, [teamId]);
    
    // Remove user from the competition altogether
    const competitionRemoveParticipantQuery = `
      DELETE FROM competition_users
      WHERE user_id = $1
      AND competition_id = $2
    `;
    await this.pool.query(competitionRemoveParticipantQuery, [userId, compId]);

    return { competitionCode, competitionName, teamId, teamName };
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

  competitionApproveTeamNameChange = async(compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}> => {
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

  competitionStaffJoinCoach = async (code: string, universityId: number, defaultSiteId: number ): Promise<{} | undefined> => {

    return {};
  }

  competitionStaffJoinSiteCoordinator = async (code: string, site: string, capacity: number): Promise<{} | undefined> => {

    return {};
  }

  competitionStaffJoinAdmin = async (code: string): Promise<{} | undefined> => {
    
    return {};
  }

  competitionUniversitiesList = async (competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined> => {

    return [{ id: 1, name: 'Macquarie University' }]
  }

  competitionAlgorithm = async(compId: number, userId: number): Promise<{} | undefined> => {
    const teamQuery = `
      SELECT * FROM competition_coach_team_list($1, $2)
      WHERE status = 'pending'::competition_team_status
    `;
    const teamResult = await this.pool.query(teamQuery, [userId, compId]);
    if (teamResult.rowCount === 0) {
      return undefined;
    }
    console.log(teamResult.rows);
    // MemberDeatails = [name, site_id, ICPCEligible, level, boersenEligible, isRemote, nationalPrizes, internationalPrizes, codeforcesRating, universityCourses, pastRegional]
    // for (let i = 0; i < teams.length; i++) {
    //   for(let j = i; j < teams.length; j++) {

    //   }
    // }
    return ;
  }

  competitionIdFromCode = async (code: string): Promise<number | undefined> => {
    const competitionIdQuery = `SELECT id FROM competitions WHERE code = $1 LIMIT 1`;
    const competitionIdResult = await this.pool.query(competitionIdQuery, [code]);
    if (competitionIdResult.rowCount === 0) {
      return undefined; 
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

  // Custom Comparator for algorithm
  private compareTeams = (team1: any, team2: any) => {

  }
}
