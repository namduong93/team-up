import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo, UniversitySiteInput } from "../services/competition_service.js";

export interface CompetitionRepository {
  competitionsSystemAdminCreate(sessionToken: string, name: string,
  earlyRegDeadline: EpochTimeStamp, generalRegDeadline: EpochTimeStamp,
  siteLocations: Array<UniversitySiteInput>, competitionCode: string): Promise<void | undefined>;

  competitionStudentJoin0(sessionToken: string, individualInfo: IndividualTeamInfo): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin1(sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin2(sessionToken: string, teamInfo: TeamInfo,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined>
  
  competitionStaffJoinCoach(code: string, universityId: number, defaultSiteId: number ): Promise<{} | undefined>;
  competitionStaffJoinSiteCoordinator(code: string, site: string, capacity: number): Promise<{} | undefined>;
  competitionStaffJoinAdmin(code: string): Promise<{} | undefined>;
  competitionUniversitiesList(competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined>;
}