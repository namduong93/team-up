import { Pool } from "pg";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamMateData, UniversityDisplayInfo } from "../../services/CompetitionService.js";
import { CompetitionRepository } from "../CompetitionRepository.js";
import { Competition, CompetitionShortDetailsObject, CompetitionSiteObject, DEFAULT_COUNTRY, CompetitionInput } from "../../models/competition/competition.js";

import { UserType } from "../../models/user/user.js";
import { parse } from "postgres-array";
import { CompetitionUserRole } from "../../models/competition/competitionUser.js";
import { DbError } from "../../errors/DbError.js";
import { University } from "../../models/university/university.js";
import { CompetitionSite, CompetitionSiteCapacity } from "../../../shared_types/Competition/CompetitionSite.js";
import { TeamDetails } from "../../../shared_types/Competition/team/TeamDetails.js";
import { Announcement } from "../../../shared_types/Competition/staff/Announcement.js";


export class SqlDbCompetitionRepository implements CompetitionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }


  getUserUniversityId = async (userId: number) => {
    const dbResult = await this.pool.query(
      `SELECT university_id as "universityId"
      FROM users AS u
      WHERE u.id = ${userId}`
    );

    return dbResult.rows[0].universityId;
  }

  /**
   * Retrieves the competition sites associated with a given competition ID.
   *
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of CompetitionSite objects.
   */
  competitionSites = async (compId: number): Promise<CompetitionSite[]> => {

    const dbResult = await this.pool.query(
      `SELECT cs.id AS "id", cs.name AS "name"
      FROM competition_sites AS cs
      WHERE cs.competition_id = ${compId}
      `
    );

    return dbResult.rows;
  }


  /**
   * Retrieves the roles of a user in a specific competition.
   *
   * @param userId The ID of the user whose roles are being retrieved.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of `CompetitionUserRole` objects representing the roles of the user in the competition.
   */
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


  /**
   * Retrieves the details of a competition by its ID.
   *
   * @param competitionId The ID of the competition to retrieve.
   * @returns A promise that resolves to a `Competition` object containing the competition details.
   * @throws {DbError} If the competition does not exist.
   */
  competitionGetDetails = async(competitionId: number): Promise<CompetitionInput> => {
    const competitionQuery = `
      SELECT id, name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region, information
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
    const competitionDetails: CompetitionInput = {
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
      information: competitionData.information,
    };

    return competitionDetails;
  }

  /**
   * Returns only shortened competition details that are displayed on a dashboard. Sites details are not included.
   * Returns competitions that the user is a part of.
   *
   * @param userId The ID of the user for whom the competitions are being retrieved.
   * @param userType The type of the user (e.g., admin, participant).
   * @returns A promise that resolves to an array of `CompetitionShortDetailsObject`, each containing details about a competition.
   */
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

  /**
   * Retrieves the default site for a given university in a specific competition.
   *
   * @param competitionId The ID of the competition.
   * @param university The university object containing the university ID.
   * @returns A promise that resolves to a `CompetitionSiteObject` containing the site details.
   * @throws {DbError} If no site is found for the given competition and university.
   */
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



  competitionStudentJoin1 = async (sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData): Promise<TeamIdObject> => {

    return { teamId: 1 };
  }

  competitionAnnouncement = async (compId: number, university: University): Promise< Announcement | undefined> => {
    const announcementResult = await this.pool.query(
      `SELECT id, message, created_date AS "createdDate", university_id AS "universityId"
      FROM competition_announcements
      WHERE competition_id = $1 AND university_id = $2`,
      [compId, university.id]
    );
    if(announcementResult.rowCount === 0) {
      return;
    }
    const announcement = announcementResult.rows[0];
    return {
      competitionId: compId,
      message: announcement.message,
      createdAt: announcement.createdDate,
      universityId: announcement.universityId
    };
  }

  competitionUniversitiesList = async (competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined> => {

    return [{ id: 1, name: 'Macquarie University' }]
  }

  /**
   * Retrieves the competition coach ID for a given competition and user id.
   *
   * @param compId The ID of the competition.
   * @param userId The ID of the user.
   * @returns A promise that resolves to the competition coach ID if the user is a coach for the competition, or undefined if not.
   * @throws {DbError} If the user is not a coach for the specified competition.
   */
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

  /**
   * Retrieves the competition ID associated with the given competition code.
   *
   * @param code The unique code of the competition.
   * @returns A promise that resolves to the competition ID.
   * @throws {DbError} If no competition is found with the given code.
   */
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

  competitionSiteCapacity = async (compId: number, siteId: number[]): Promise<Array<CompetitionSiteCapacity> | undefined> => {
    const siteList = await this.pool.query('SELECT id, capacity FROM competition_sites WHERE competition_id = $1 AND id = ANY($2::int[]);', [compId, siteId])
    return siteList.rows
  }
}
