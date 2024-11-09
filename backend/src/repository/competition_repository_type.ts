import { Competition, CompetitionIdObject, CompetitionShortDetailsObject, CompetitionSiteObject, CompetitionTeamNameObject, CompetitionWithdrawalReturnObject } from "../models/competition/competition.js";
import { CompetitionStaff, CompetitionStudentDetails, CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { University } from "../models/university/university.js";
import { UserType } from "../models/user/user.js";
import { IncompleteTeamIdObject, IndividualTeamInfo, TeamIdObject, TeamMateData, UniversityDisplayInfo } from "../services/competition_service.js";
import './competition/sqldb'
import { CompetitionSite } from '../../shared_types/Competition/CompetitionSite.js';
import { SeatAssignment } from "../models/team/team.js";
import { ParticipantTeamDetails, TeamDetails } from "../../shared_types/Competition/team/TeamDetails.js";
import { StudentInfo } from "../../shared_types/Competition/student/StudentInfo.js";
import { StaffInfo } from "../../shared_types/Competition/staff/StaffInfo.js";
import { AttendeesDetails } from "../../shared_types/Competition/staff/AttendeesDetails.js";
import { EditRego } from "../../shared_types/Competition/staff/Edit.js";

export type CompetitionRole = 'Participant' | 'Coach' | 'Admin' | 'Site-Coordinator';

export interface CompetitionRepository {
  competitionStaffRegoToggles(userId: number, compId: number): Promise<EditRego>;
  competitionCoachCheck(userId: number, compId: number): Promise<void>;
  competitionStaffUpdate(userId: number, staffList: StaffInfo[], compId: number): Promise<void>;
  competitionStudentsUpdate(userId: number, studentList: StudentInfo[], compId: number): Promise<void>;
  coachCheckIdsStudent (userId: number, userIds: Array<number>, compId: number): Promise<void>;
  coachCheckIds(userId: number, teamIds: Array<number>, compId: number): Promise<void>;
  competitionTeamsUpdate(teamList: Array<TeamDetails>, compId: number): Promise<void>;
  competitionSites(compId: number): Promise<Array<CompetitionSite>>;
  competitionAttendees(userId: number, compId: number): Promise<Array<AttendeesDetails>>;
  competitionStaff(userId: number, compId: number): Promise<StaffInfo[]>;
  competitionStudents(userId: number, compId: number): Promise<StudentInfo[]>;
  competitionRoles(userId: number, compId: number): Promise<Array<CompetitionUserRole>>;
  competitionTeams(userId: number, compId: number): unknown;
  competitionSystemAdminCreate(userId: number, competition: Competition): Promise<CompetitionIdObject>;
  competitionSystemAdminUpdate(userId: number, competition: Competition): Promise<{}>;
  competitionGetDetails(competitionId: number): Promise<Competition>;
  competitionTeamDetails(userId: number, compId: number): Promise<ParticipantTeamDetails>;
  competitionTeamInviteCode(userId: number, compId: number): Promise<string>;
  competitionTeamJoin(userId: number, compId: number, teamCode: string, university: University): Promise<CompetitionTeamNameObject>;
  competitionStudentDetails(userId: number, compId: number): Promise<CompetitionStudentDetails>;

  competitionUniversityDefaultSite(competitionId: number, university: University): Promise<CompetitionSiteObject>;
  competitionStudentJoin(competitionUserInfo: CompetitionUser, university: University): Promise<{}>;
  competitionStudentJoin1(sessionToken: string, individualInfo: IndividualTeamInfo,
    teamMate1: TeamMateData): Promise<IncompleteTeamIdObject>;
  competitionStudentJoin2(sessionToken: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject>;
  competitionStudentWithdraw(userId: number, compId: number): Promise<CompetitionWithdrawalReturnObject>;

  competitionApproveTeamAssignment(userId: number, compId: number, approveIds: Array<number>): Promise<{}>;
  competitionRequestTeamNameChange(userId: number, compId: number, newTeamName: string): Promise<number>;
  competitionApproveTeamNameChange(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}>;
  competitionRequestSiteChange(userId: number, compId: number, newSiteId: number): Promise<number>;
  competitionApproveSiteChange(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}>;
  competitionTeamSeatAssignments(userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{}>;


  competitionStaffJoin(compId: number, competitionStaffInfo: CompetitionStaff): Promise<{}>;
  competitionUniversitiesList(compId: number): Promise<Array<UniversityDisplayInfo> | undefined>;

  competitionIdFromCode(code: string): Promise<number>;
  competitionsList(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject>>;
  competitionAlgorithm(compId: number, userId: number): Promise<{} | undefined>;
}