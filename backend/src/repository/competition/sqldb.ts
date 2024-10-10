import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../../services/competition_service.js";
import { CompetitionRepository } from "../competition_repository_type.js";
import { Competition, CompetitionIdObject } from "../../models/competition/competition.js";
import ShortUniqueId from "short-unique-id";

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

  competitionsSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject | undefined> => {
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

      console.log(siteObject.universityId)
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

  competitionsSystemAdminList = async(userId: number): Promise<Array<Competition> | undefined> => {
    // Find all competition ids that user is an admin for
    const competitionIdsQuery = `
      SELECT competition_id 
      FROM competition_admins 
      WHERE staff_id = $1
    `;

    const competitionIdsResult = await this.pool.query(competitionIdsQuery, [userId]);
    const competitionIdArray = competitionIdsResult.rows.map(row => row.competition_id);
    
    // Find competition details for each competition
    let competitions: Competition[] = [];
    for (const competitionId of competitionIdArray) {
      // Find competition details
      const competitionDetailsQuery = `
        SELECT name, team_size, early_reg_deadline, general_reg_deadline, code
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

      competitions.push(competition);
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
}
