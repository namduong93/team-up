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

export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

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

    // Insert site-relevant details into tables
    for (const siteObject of competition.siteLocations) {
      // Create a site based on
      const siteQuery = `
        INSERT INTO competition_sites (competition_id, university_id, name, default_site)
        VALUES ($1, $2, $3, $4);
      `;

      const siteValues = [
        competitionId,
        siteObject.universityId,
        siteObject.name,
        true // Set default_site to true since on the FE, the default site is the one that is created on competition creation
      ];

      await this.pool.query(siteQuery, siteValues);
    }

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
    const competitionMap: Map<number, { userType: Set<CompetitionUserType>, competition: Competition }> = new Map();

    if (userType === UserType.SYSTEM_ADMIN) {
      // Find all competition ids that user is an admin for
      const competitionIdsQuery = `
        SELECT competition_id 
        FROM competition_admins 
        WHERE staff_id = $1
      `;
      const competitionIdsResult = await this.pool.query(competitionIdsQuery, [userId]);
      this.addCompetitionIdsToMap(competitionIdsResult.rows, competitionMap, CompetitionUserType.SYSTEM_ADMIN);
    } else if (userType === UserType.STUDENT) {
      // Find all competition ids that user is a participant in
      const competitionIdsQuery = `
        SELECT competition_id 
        FROM competition_participants 
        WHERE student_id = $1
      `;
      const competitionIdsResult = await this.pool.query(competitionIdsQuery, [userId]);
      this.addCompetitionIdsToMap(competitionIdsResult.rows, competitionMap, CompetitionUserType.PARTICIPANT);
    } else {
      // Find all competition ids that user is a coach for
      let competitionIdsQuery = `
        SELECT competition_id 
        FROM competition_coaches 
        WHERE staff_id = $1
      `;
      let competitionIdsResult = await this.pool.query(competitionIdsQuery, [userId]);
      this.addCompetitionIdsToMap(competitionIdsResult.rows, competitionMap, CompetitionUserType.COACH);

      // Find all competition ids that user is a site coordinator for
      competitionIdsQuery = `
        SELECT competition_id 
        FROM competition_site_coordinators 
        WHERE staff_id = $1
      `;
      competitionIdsResult = await this.pool.query(competitionIdsQuery, [userId]);
      this.addCompetitionIdsToMap(competitionIdsResult.rows, competitionMap, CompetitionUserType.SITE_COORDINATOR);
    }

    const competitionIdArray = Array.from(competitionMap.keys());

    // Find competition details for each competition
    let competitions: Array<{ userType: CompetitionUserType[], competition: Competition }> = [];
    for (const competitionId of competitionIdArray) {
      // Find competition details
      const competitionDetailsQuery = `
        SELECT id, name, team_size, early_reg_deadline, general_reg_deadline, code
        FROM competitions
        WHERE id = $1
      `;

      const competitionDetailsResult = await this.pool.query(competitionDetailsQuery, [competitionId]);
      const competition = competitionDetailsResult.rows[0];

      // Find site details
      const siteQuery = `
        SELECT university_id, name
        FROM competition_sites
        WHERE competition_id = $1
      `;

      const siteResult = await this.pool.query(siteQuery, [competitionId]);
      const siteLocations = siteResult.rows;

      // Add site details to competition object
      competition.siteLocations = siteLocations;

      const userTypeSet = competitionMap.get(competitionId)?.userType;
      if (userTypeSet) {
        competitions.push({ userType: Array.from(userTypeSet), competition });
      }
    }

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
  private addCompetitionIdsToMap = (rows: any[], competitionMap: Map<number, { userType: Set<CompetitionUserType>, competition: Competition }>, userType: CompetitionUserType) => {
    rows.forEach(row => {
      if (!competitionMap.has(row.competition_id)) {
        competitionMap.set(row.competition_id, { userType: new Set([userType]), competition: row });
      } else {
        competitionMap.get(row.competition_id)?.userType.add(userType);
      }
    });
  }
}
