import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionShortDetailsObject, CompetitionIdObject, CompetitionSiteObject, CompetitionUserType, CompetitionDetails } from "../../models/competition/competition.js";
import ShortUniqueId from "short-unique-id";
import { UserType } from "../../models/user/user.js";
import { parse } from "postgres-array";

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

  competitionRoles = async (userId: number, compId: number) => {
    const dbResult = await this.pool.query(
      `SELECT cu.competition_roles AS roles
      FROM competition_users AS cu WHERE cu.user_id = ${userId} AND cu.competition_id = ${compId}`
    );
    return parse(dbResult.rows[0].roles);
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

  competitionGetDetails = async(competitionId: number): Promise<CompetitionDetails | undefined> => {
    const competitionQuery = `
      SELECT id, name, team_size, early_reg_deadline, general_reg_deadline, code
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
    const competitionDetails: CompetitionDetails = {
      id: competitionData.id,
      name: competitionData.name,
      teamSize: competitionData.team_size,
      earlyRegDeadline: competitionData.early_reg_deadline,
      generalRegDeadline: competitionData.general_reg_deadline,
      code: competitionData.code,
      siteLocations,
    };
  
    return competitionDetails;
  }

  // Returns only shortened competition details that are displayed on a dashboard. Sites details are not included.
  // Returns competitions that the user is a part of.
  competitionsList = async(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject> | undefined> => {
    const competitionMap: Map<number, { userType: Array<CompetitionUserType>, competition: CompetitionDetails }> = new Map();
    
    const comps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
        general_reg_deadline AS "generalRegDeadline" FROM competition_list(${userId})`
    );
    // TODO: Change the db query to also get the user competition roles and return those too.
    this.addCompetitionIdsToMap(comps.rows, competitionMap, CompetitionUserType.PARTICIPANT);

    const competitions: Array<CompetitionShortDetailsObject> = [...competitionMap.values()];

    return competitions;
  }

  competitionStudentJoin0 = async (sessionToken: string,
    individualInfo: IndividualTeamInfo): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
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

  // Helper function to add competition ids to map
  private addCompetitionIdsToMap = (rows: any[], competitionMap: Map<number, { userType: Array<CompetitionUserType>, competition: Competition }>, userType: CompetitionUserType) => {
    rows.forEach(row => {
      if (!competitionMap.has(row.id)) {
        competitionMap.set(row.id, { userType: [userType], competition: row });
      } else {
        competitionMap.get(row.id)?.userType.push(userType);
      }
    });
  }
}
