import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionDetailsObject, CompetitionIdObject, CompetitionUserType } from "../../models/competition/competition.js";
import ShortUniqueId from "short-unique-id";
import { UserType } from "../../models/user/user.js";

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
    const competitionQuery = `
      INSERT INTO competitions (name, team_size, early_reg_deadline, general_reg_deadline, code)
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

    // Insert user as competition admin into competition_admins table
    const adminQuery = `
      INSERT INTO competition_admins (staff_id, competition_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    await this.pool.query(adminQuery, [userId, competitionId]);

    // Insert site-relevant details in bulk using UNNEST for batch insertion
    const siteQuery = `
      INSERT INTO competition_sites (competition_id, university_id, name, default_site)
      SELECT $1, unnest($2::int[]), unnest($3::text[]), unnest($4::boolean[]);
    `;

    const siteValues = [
      competitionId,
      competition.siteLocations.map(site => site.universityId),   // Array of universityIds
      competition.siteLocations.map(site => site.name),           // Array of names
      competition.siteLocations.map(() => true)                   // Array of true for defaultSite
    ];

    await this.pool.query(siteQuery, siteValues);

    // Return the competition id
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
    const competitionMap: Map<number, { userType: Array<CompetitionUserType>, competition: Competition }> = new Map();
    
    const participantComps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
        general_reg_deadline AS "generalRegDeadline" FROM competition_list_participants(${userId})`
    );
    this.addCompetitionIdsToMap(participantComps.rows, competitionMap, CompetitionUserType.PARTICIPANT);
    
    const coachComps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
      general_reg_deadline AS "generalRegDeadline" FROM competition_list_coaches(${userId})`
    );
    this.addCompetitionIdsToMap(coachComps.rows, competitionMap, CompetitionUserType.COACH);

    const siteCoordinatorComps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
      general_reg_deadline AS "generalRegDeadline" FROM competition_list_site_coordinators(${userId})`
    );
    this.addCompetitionIdsToMap(siteCoordinatorComps.rows, competitionMap, CompetitionUserType.SITE_COORDINATOR);

    const adminComps = await this.pool.query(
      `SELECT id, name, early_reg_deadline AS "earlyRegDeadline",
      general_reg_deadline AS "generalRegDeadline" FROM competition_list_admins(${userId})`
    );
    this.addCompetitionIdsToMap(adminComps.rows, competitionMap, CompetitionUserType.ADMIN);

    const competitions: Array<CompetitionDetailsObject> = [...competitionMap.values()];
    // console.log('map:', competitionMap);
    // console.log('array:', competitions);

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
