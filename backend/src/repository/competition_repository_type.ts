import { Competition, CompetitionIdObject } from "../models/competition/competition.js";
import { UserTypeObject } from "../models/user/user.js";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../services/competition_service.js";

export interface CompetitionRepository {
  competitionSystemAdminCreate(userId: number, competition: Competition): Promise<CompetitionIdObject | undefined>;
  competitionSystemAdminUpdate(userId: number, competition: Competition): Promise<{} | undefined>;

  competitionStudentJoin0(sessionToken: string, individualInfo: IndividualTeamInfo): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin1(sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin2(sessionToken: string, teamInfo: TeamInfo,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined>
  
  competitionStaffJoinCoach(code: string, universityId: number, defaultSiteId: number ): Promise<{} | undefined>;
  competitionStaffJoinSiteCoordinator(code: string, site: string, capacity: number): Promise<{} | undefined>;
  competitionStaffJoinAdmin(code: string): Promise<{} | undefined>;
  competitionUniversitiesList(competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined>;

  competitionsList(userId: number, userType: UserTypeObject): Promise<Array<Competition> | undefined>;
}