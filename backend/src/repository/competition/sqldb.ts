import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionDetailsObject, CompetitionIdObject } from "../../models/competition/competition.js";
import ShortUniqueId from "short-unique-id";
import { UserType } from "../../models/user/user.js";
import { CompetitionUser, CompetitionUserRole } from "../../models/competition/competitionUser.js";
import { DEFAULT_TEAM_SIZE, TeamStatus } from "../../models/team/team.js";

// Set up short-unique-id library for generating competition codes
const { randomUUID } = new ShortUniqueId({
  dictionary: 'alphanum_upper',
  length: 8
});

interface CompetitionTeam {
  teamName: string;
  memberName1?: string;
  memberName2?: string;
  memberName3?: string;
  status: 'pending' | 'registered' | 'unregistered';
}

export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  competitionTeams = async (userId: number, compId: number): Promise<Array<CompetitionTeam>> => {
    const dbResult = await this.pool.query(
      `SELECT team_name AS "teamName", member_name1 AS "memberName1", member_name2 AS "memberName2", member_name3 AS "memberName3", status
      FROM competition_team_list(${userId}, ${compId})`);
    
    return dbResult.rows;
  };

  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject | undefined> => {
    // Set default team size to 3 if not provided
    const teamSize = competition.teamSize ?? 3;

    // Create new competition code
    const competitionCode = randomUUID(); // TODO: check if code already exists

    
    // Insert competition into competitions table
    const competitionQuery =
    `INSERT INTO competitions (name, team_size, early_reg_deadline, general_reg_deadline, code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, code;
    `;
    
    const competitionValues = [
      competition.name,
      teamSize,
      new Date(competition.earlyRegDeadline),
      new Date(competition.generalRegDeadline),
      competitionCode
    ];
    
    const competitionResult = await this.pool.query(competitionQuery, competitionValues);
    const competitionId = competitionResult.rows[0].id;
    
    await this.pool.query(
      `INSERT INTO competition_users (user_id, competition_id, competition_roles)
      VALUES (${userId}, ${competitionId}, ARRAY['admin']::competition_role_enum[])`
    );
    
    // for the normal siteLocations that have university Ids:
    competition.siteLocations.forEach(async ({ universityId, name }) => {
      await this.pool.query(
        `INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES (${competitionId}, ${universityId}, '${name}', 0)`
      );
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
      SET name = $1, team_size = $2, early_reg_deadline = $3, general_reg_deadline = $4
      WHERE id = $5;
    `;

    const competitionUpdateValues = [
      competition.name,
      competition.teamSize,
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

  competitionsList = async(userId: number, userType: UserType): Promise<Array<CompetitionDetailsObject> | undefined> => {
    const competitionMap: Map<number, { userType: Array<CompetitionUserRole>, competition: Competition }> = new Map();
    
    const comps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
        general_reg_deadline AS "generalRegDeadline" FROM competition_list(${userId})`
    );
    // TODO: Change the db query to also get the user competition roles and return those too.
    this.addCompetitionIdsToMap(comps.rows, competitionMap, CompetitionUserRole.PARTICIPANT);

    const competitions: Array<CompetitionDetailsObject> = [...competitionMap.values()];

    return competitions;
  }



  competitionStudentJoin = async (competitionUserInfo: CompetitionUser): Promise<{} | undefined> => {
    // First insert the user into the competition_users table
    let userId = competitionUserInfo.userId;
    let competitionId = competitionUserInfo.competitionId;
    let competitionRoles = competitionUserInfo.competitionRoles;
    let ICPCEligible = competitionUserInfo.ICPCEligible;
    let competitionLevel = competitionUserInfo.competitionLevel;
    let boersenEligible = competitionUserInfo.boersenEligible;
    let degreeYear = competitionUserInfo.degreeYear;
    let degree = competitionUserInfo.degree;
    let isRemote = competitionUserInfo.isRemote;
    let nationalPrizes = competitionUserInfo.nationalPrizes;
    let internationalPrizes = competitionUserInfo.internationalPrizes;
    let codeforcesRating = competitionUserInfo.codeforcesRating;
    let universityCourses = competitionUserInfo.universityCourses;

    const competitionJoinQuery = `
      INSERT INTO competition_users (user_id, competition_id, competition_roles, icpc_eligible, competition_level, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
      universityCourses
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
    let teamNameApproved = false;
    let teamSize = DEFAULT_TEAM_SIZE;
    let participants = [userId];

    let teamNameQuery = `
      INSERT INTO competition_teams (name, team_status, team_name_approved, team_size, participants, university_id, competition_id)
      VALUES (CONCAT('Team#', currval(pg_get_serial_sequence('competition_teams', 'id'))), $1,  $2, $3, $4, $5)
      RETURNING id
    `;
    const teamNameValues = [
      userId,  
      teamStatus,
      teamNameApproved,
      teamSize,
      participants,
      universityId,  // university_id from users table
      competitionId
    ];

    // Insert the team into competition_teams table
    await this.pool.query(teamNameQuery, teamNameValues);
    return {};
  }

  competitionStudentJoin1 = async (sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, teamInfo: TeamInfo,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined> => {

    return { teamId: 1 };
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

  //Helper function to get the user's competition roles
  competitionUserRoles = async (userId: number, competitionId: number): Promise<Array<CompetitionUserRole> | undefined> => {
    const userTypeObject = await this.pool.query(
      `SELECT competition_roles FROM competition_users WHERE user_id = $1 AND competition_id = $2`,
      [userId, competitionId]
    );
    return userTypeObject.rows[0].competition_roles;
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
