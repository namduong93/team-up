import { Competition, CompetitionDetailsObject, CompetitionIdObject } from "../models/competition/competition.js";
import { UserType } from "../models/user/user.js";
import { IncompleteTeamIdObject, IndividualTeamInfo, StudentInfo, TeamIdObject, TeamInfo, TeamMateData, UniversityDisplayInfo } from "../services/competition_service.js";

export type CompetitionRole = 'participant' | 'coach' | 'admin' | 'site-coordinator';

export interface CompetitionRepository {
  competitionStudents(userId: number, compId: number): Promise<StudentInfo[]>;
  competitionRoles(userId: number, compId: number): Promise<Array<CompetitionRole>>;
  competitionTeams(userId: number, compId: number): unknown;
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

  competitionsList(userId: number, userType: UserType): Promise<Array<CompetitionDetailsObject> | undefined>;
}