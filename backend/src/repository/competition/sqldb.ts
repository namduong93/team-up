import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, StudentInfo, TeamIdObject, TeamDetails, TeamMateData, UniversityDisplayInfo, StaffInfo } from "../../services/competition_service.js";
import { CompetitionRepository, CompetitionRole } from "../competition_repository_type.js";
import { Competition, CompetitionShortDetailsObject, CompetitionIdObject, CompetitionSiteObject, DEFAULT_COUNTRY, CompetitionWithdrawalReturnObject } from "../../models/competition/competition.js";

import ShortUniqueId from "short-unique-id";
import { UserType } from "../../models/user/user.js";
import { parse } from "postgres-array";
import { CompetitionUser, CompetitionUserRole } from "../../models/competition/competitionUser.js";
import { DEFAULT_TEAM_SIZE, TeamStatus } from "../../models/team/team.js";

// Set up short-unique-id library for generating competition codes
const { randomUUID } = new ShortUniqueId({
  dictionary: 'alphanum_upper',
  length: 8
});

export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
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
        `SELECT team_id AS "teamId", university_id AS "universityId", team_name AS "teamName",
        member1, member2, member3,
        status, team_name_approved AS "teamNameApproved"
        FROM competition_admin_team_list(${compId})`
      );

      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.COACH)) {
      const dbResult = await this.pool.query(
        `SELECT team_id AS "teamId", university_id AS "universityId", team_name AS "teamName",
          member1, member2, member3,
          status, team_name_approved AS "teamNameApproved"
        FROM competition_coach_team_list(${userId}, ${compId})`);

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
    `INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, code;
    `;
    
    const competitionValues = [
      competition.name,
      teamSize,
      new Date(competition.createdDate),
      new Date(competition.earlyRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.code
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
      SELECT id, name, team_size, created_date, early_reg_deadline, general_reg_deadline, code
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
      code: competitionData.code,
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

  competitionStudentWithdraw = async (userId: number, competitionId: number): Promise<CompetitionWithdrawalReturnObject | undefined> => {
    // Check if the student exists as a participant in the competition
    const userInCompetitionQuery = `
      SELECT 1 FROM competition_users WHERE user_id = $1 AND competition_id = $2
    `;
    const userInCompetitionResult = await this.pool.query(userInCompetitionQuery, [userId, competitionId]);
    if (userInCompetitionResult.rowCount === 0) {
      return undefined; // TODO: throw error
    }

    // Check if the competition exists
    const competitionExistQuery = `
      SELECT code, name FROM competitions WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [competitionId]);
    if (competitionExistResult.rowCount === 0) {
      return undefined; // TODO: throw error
    }
    const competitionCode = competitionExistResult.rows[0].code;
    const competitionName = competitionExistResult.rows[0].name;

    // Remove user from the team and put the team back to pending state in a single query
    // NOTE: I wanted to combine these two queries into a single query as commented but doing so makes the set status query not work for some reasons
    // const teamRemoveMemberAndSetPendingQuery = `
    //   WITH updated_team AS (
    //     UPDATE competition_teams
    //     SET participants = array_remove(participants, $1)
    //     WHERE $1 = ANY(participants) AND competition_id = $2
    //     RETURNING id, participants
    //   )
    //   UPDATE competition_teams
    //   SET team_status = 'pending'::competition_team_status
    //   WHERE id = (SELECT id FROM updated_team)
    // `;
    // await this.pool.query(teamRemoveMemberAndSetPendingQuery, [userId, competitionId]);

    const teamRemoveMemberQuery = `
      UPDATE competition_teams
      SET participants = array_remove(participants, $1)
      WHERE $1 = ANY(participants) AND competition_id = $2
      RETURNING id, name
    `;
    const teamRemoveMemberResult = await this.pool.query(teamRemoveMemberQuery, [userId, competitionId]);
    if (teamRemoveMemberResult.rowCount === 0) {
      return undefined; // TODO: throw error that user is not in a team in this competition
    }
    const teamId = teamRemoveMemberResult.rows[0]?.id;
    const teamName = teamRemoveMemberResult.rows[0]?.name;

    const teamSetPendingQuery = `
      UPDATE competition_teams
      SET team_status = 'pending'::competition_team_status
      WHERE id = $1
    `;
    await this.pool.query(teamSetPendingQuery, [teamId]);
    
    // Remove user from the competition altogether
    const competitionRemoveParticipantQuery = `
      DELETE FROM competition_users
      WHERE user_id = $1
      AND competition_id = $2
    `;
    await this.pool.query(competitionRemoveParticipantQuery, [userId, competitionId]);

    return { competitionCode, competitionName, teamId, teamName };
  }

  competitionRequestTeamNameChange = async(userId: number, competitionId: number, teamId: number, newTeamName: string): Promise<{} | undefined> => {
    // Check if the user is a valid member of this team
    const teamMemberCheckQuery = `
      SELECT 1
      FROM competition_teams
      WHERE id = $1
      AND competition_id = $2
      AND $3 = ANY(participants)
    `;
    const teamMemberCheckResult = await this.pool.query(teamMemberCheckQuery, [teamId, competitionId, userId]);
    if (teamMemberCheckResult.rowCount === 0) {
      return undefined; // TODO: throw error that user is not a member of this team
    }

    // Update the pending name in the competition teams table
    const teamNameUpdateQuery = `
      UPDATE competition_teams
      SET pending_name = $3
      WHERE id = $2
      AND competition_id = $1
    `;
    const result = await this.pool.query(teamNameUpdateQuery, [competitionId, teamId, newTeamName]);

    if (result.rowCount === 0) {
      return undefined; // TODO: throw error that no such team or competition exists
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
}
