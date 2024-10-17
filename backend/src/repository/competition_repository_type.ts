import { Competition, CompetitionDetailsObject, CompetitionIdObject } from "../models/competition/competition.js";
import { CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { UserType } from "../models/user/user.js";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../services/competition_service.js";

export interface CompetitionRepository {
  competitionTeams(userId: number, compId: number): unknown;
  competitionSystemAdminCreate(userId: number, competition: Competition): Promise<CompetitionIdObject | undefined>;
  competitionSystemAdminUpdate(userId: number, competition: Competition): Promise<{} | undefined>;

  competitionStudentJoin(competitionUserInfo: CompetitionUser): Promise<{} | undefined>;
  competitionStudentJoin1(sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin2(sessionToken: string, teamInfo: TeamInfo,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined>
  
  competitionStaffJoinCoach(code: string, universityId: number, defaultSiteId: number ): Promise<{} | undefined>;
  competitionStaffJoinSiteCoordinator(code: string, site: string, capacity: number): Promise<{} | undefined>;
  competitionStaffJoinAdmin(code: string): Promise<{} | undefined>;
  competitionUniversitiesList(competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined>;

  competitionsList(userId: number, userType: UserType): Promise<Array<CompetitionDetailsObject> | undefined>;
  competitionUserRoles(userId: number, competitionId: number): Promise<Array<CompetitionUserRole> | undefined>;
  competitionIdFromCode(code: string): Promise<number | undefined>;
}