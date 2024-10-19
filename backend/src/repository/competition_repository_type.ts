import { Competition, CompetitionIdObject, CompetitionShortDetailsObject } from "../models/competition/competition.js";
import { CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { UserType } from "../models/user/user.js";
import { IncompleteTeamIdObject, IndividualTeamInfo, StudentInfo, TeamIdObject, TeamDetails, TeamMateData, UniversityDisplayInfo, StaffInfo } from "../services/competition_service.js";

export type CompetitionRole = 'Participant' | 'Coach' | 'Admin' | 'Site-Coordinator';

export interface CompetitionRepository {
  competitionStaff(userId: number, compId: number): Promise<StaffInfo[]>;
  competitionStudents(userId: number, compId: number): Promise<StudentInfo[]>;
  competitionRoles(userId: number, compId: number): Promise<Array<CompetitionUserRole>>;
  competitionTeams(userId: number, compId: number): unknown;
  competitionSystemAdminCreate(userId: number, competition: Competition): Promise<CompetitionIdObject | undefined>;
  competitionSystemAdminUpdate(userId: number, competition: Competition): Promise<{} | undefined>;
  competitionGetDetails(competitionId: number): Promise<Competition | undefined>;

  competitionStudentJoin(competitionUserInfo: CompetitionUser): Promise<{} | undefined>;
  competitionStudentJoin1(sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined>;
  competitionStudentJoin2(sessionToken: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined>
  
  competitionStaffJoinCoach(code: string, universityId: number, defaultSiteId: number ): Promise<{} | undefined>;
  competitionStaffJoinSiteCoordinator(code: string, site: string, capacity: number): Promise<{} | undefined>;
  competitionStaffJoinAdmin(code: string): Promise<{} | undefined>;
  competitionUniversitiesList(competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined>;

  competitionIdFromCode(code: string): Promise<number | undefined>;
  competitionsList(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject> | undefined>;
}