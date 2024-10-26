import { BAD_REQUEST, COMPETITION_ADMIN_REQUIRED, COMPETITION_CODE_EXISTED, COMPETITION_NOT_FOUND, COMPETITION_STUDENT_REQUIRED, COMPETITION_USER_REGISTERED } from "../controllers/controller_util/http_error_handler.js";
import { ServiceError } from "../errors/service_error.js";
import { Competition, CompetitionIdObject, CompetitionShortDetailsObject } from "../models/competition/competition.js";
import { CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { UserType } from "../models/user/user.js";
import { CompetitionRepository, CompetitionRole } from "../repository/competition_repository_type.js";
import { NotificationRepository } from "../repository/notification_repository_type.js";
import { UserRepository } from "../repository/user_repository_type.js";

export type IncompleteTeamIdObject = { incompleteTeamId: number };
export type TeamIdObject = { teamId: number };
export type UniversityDisplayInfo = { id: number, name: string };

export interface IndividualTeamInfo {
  ICPCEligible: boolean;
  competitionLevel: string;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
}


export type MemberDetails = [
  name: string,
  siteId: number,
  ICPCEligible: boolean,
  level: string,
  boersenEligible: boolean,
  isRemote: boolean
];

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
}
export interface TeamDetails {
  teamId: number;
  universityId: number;
  teamName: string;
  member1?: MemberDetails;
  member2?: MemberDetails;
  member3?: MemberDetails;
  status: 'pending' | 'registered' | 'unregistered';
  teamNameApproved: boolean;
};
export interface TeamMateData {
  teamMateEmail: string;
  teamMateName: string;
  teamMateICPCEmail: string;
  teamMateDegreeYear: number;
  teamMateDegree: string;
};

export interface StudentInfo {
  userId: number;
  universityId: number;
  name: string;
  sex: string;
  email: string;
  studentId: string;
  status: string;
  level: string;
  tshirtSize: string;
  siteName: string;
  teamName?: string;
};

export enum StaffAccess {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}
export interface StaffInfo {
  userId: number;
  name: string;
  roles: CompetitionRole[];
  universityName: string;
  access: StaffAccess;
  email: string;
}
export interface ParticipantTeamDetails {
  compName: string;
  teamName: string;
  teamSite: string;
  teamSeat?: string;
  teamLevel: string;
  startDate: Date;
  students: Array<{
    name: string;
    email: string;
    bio: string;
    preferredContact: string;
  }>;
  coach: {
    name: string;
    email: string;
    bio: string;
  }
}


export class CompetitionService {
  private competitionRepository: CompetitionRepository;
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  
  constructor(competitionRepository: CompetitionRepository, userRepository: UserRepository, notificationRepository: NotificationRepository) {
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  competitionTeamDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/team/details route is only for participants to use');
    }

    return await this.competitionRepository.competitionTeamDetails(userId, compId);
  }

  competitionStaff = async (userId: number, compId: number): Promise<Array<StaffInfo>> => {
    return await this.competitionRepository.competitionStaff(userId, compId);
  }

  competitionStudents = async (userId: number, compId: number): Promise<Array<StudentInfo>> => {
    return await this.competitionRepository.competitionStudents(userId, compId);
  }

  competitionRoles = async (userId: number, compId: number) => {
    return await this.competitionRepository.competitionRoles(userId, compId);
  }
  
  competitionTeams = async (userId: number, compId: number) => {
    return await this.competitionRepository.competitionTeams(userId, compId);
  }
  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw COMPETITION_ADMIN_REQUIRED;
    }

    // const uniqueNames = this.checkUniqueSiteNames(competition);
    // if (!uniqueNames) {
    //   throw SITE_NAMES_MUST_BE_UNIQUE;
    // }
    
    const competitionId = await this.competitionRepository.competitionSystemAdminCreate(userId, competition);

    if (!competitionId) {
      throw COMPETITION_CODE_EXISTED;
    }

    return competitionId;
  }

  competitionSystemAdminUpdate = async (userId: number, competition: Competition): Promise<{} | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw COMPETITION_ADMIN_REQUIRED;
    }

    // const uniqueNames = this.checkUniqueSiteNames(competition);
    // if (!uniqueNames) {
    //   throw SITE_NAMES_MUST_BE_UNIQUE;
    // }
    
    const competitionId = await this.competitionRepository.competitionSystemAdminUpdate(userId, competition);

    // TODO: Handle different HTTP status codes after updating error handling
    if (!competitionId) {
      throw BAD_REQUEST;
    }
    
    return competitionId;
  }

  competitionGetDetails = async (competitionId: number): Promise<Competition | undefined> => {
    if (!competitionId) {
      throw BAD_REQUEST;
    }
    
    const competitionDetails = await this.competitionRepository.competitionGetDetails(competitionId);

    if (!competitionDetails) {
      throw BAD_REQUEST;
    }
    
    return competitionDetails;
  }

  competitionsList = async (userId: number): Promise<Array<CompetitionShortDetailsObject> | undefined> => {
    // Get user type for easier database queries
    const userTypeObject = await this.userRepository.userType(userId);

    const competitions = await this.competitionRepository.competitionsList(userId, userTypeObject.type);
    
    return competitions;
  }

  competitionCodeStatus = async (userId: number, code: string): Promise<{} | undefined> => {
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw COMPETITION_STUDENT_REQUIRED;
    }

    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw COMPETITION_NOT_FOUND;
    }

    const competitionRoles = await this.competitionRepository.competitionRoles(userId, competitionId);
    if (competitionRoles.length > 0) { // either they are already a participant or a staff
      throw COMPETITION_USER_REGISTERED;
    }

    return {};
  }

  competitionStudentJoin = async (code: string, competitionUserInfo: CompetitionUser): Promise<void> => {
    const userTypeObject = await this.userRepository.userType(competitionUserInfo.userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw COMPETITION_STUDENT_REQUIRED;
    }

    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw COMPETITION_NOT_FOUND;
    }

    competitionUserInfo.competitionId = competitionId;
    const competitionRoles = await this.competitionRepository.competitionRoles(competitionUserInfo.userId, competitionId);
    if (competitionRoles.length > 0) { // either they are already a participant or a staff
      throw COMPETITION_USER_REGISTERED;
    }
    competitionUserInfo.competitionRoles = [CompetitionUserRole.PARTICIPANT];
    await this.competitionRepository.competitionStudentJoin(competitionUserInfo);
    return;
  }

  competitionStudentJoin1 = async (sessionToken: string, code: string, individualInfo: IndividualTeamInfo, teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, code: string, teamInfo: TeamDetails,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined> => {

    return { teamId: 1 };
  }

  competitionStudentWithdraw = async (userId: number, compId: number): Promise<string | undefined> => {
    // Check if user is a student or a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError('User is not a student.', ServiceError.Auth);
    }

    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, "User is not a participant for this competition.");
    }
    
    // Remove student from competition
    const result = await this.competitionRepository.competitionStudentWithdraw(userId, compId);

    // Notify team members and coach
    await this.notificationRepository.notificationWithdrawal(userId, compId, result.competitionName, result.teamId, result.teamName);

    return result.competitionCode;
  }

  competitionRequestTeamNameChange = async (userId: number, compId: number, newTeamName: string): Promise<{} | undefined> => {
    // Check if user is a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, "User is not a student.");
    }

    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, "User is not a participant for this competition.");
    }

    // Request team name change
    const teamId = await this.competitionRepository.competitionRequestTeamNameChange(userId, compId, newTeamName);

    // Notify coach
    await this.notificationRepository.notificationRequestTeamNameChange(teamId, compId);

    return {};
  }

  competitionApproveTeamNameChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Check if user is a coach
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.COACH)) {
      throw new ServiceError(ServiceError.Auth, "User is not a coach for this competition.");
    }

    // Approve or reject team name change
    await this.competitionRepository.competitionApproveTeamNameChange(compId, approveIds, rejectIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamNameChange(compId, approveIds, rejectIds);

    return {};
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

  // Check to make sure every competition name is unique
  // checkUniqueSiteNames = (competition: Competition): boolean => {
  //   const allLocations = [];
  
  //   if (competition.siteLocations) {
  //     allLocations.push(...competition.siteLocations.map(site => site.name));
  //   }
  //     if (competition.otherSiteLocations) {
  //     allLocations.push(...competition.otherSiteLocations.map(site => site.name));
  //   }
  
  //   // Use a Set to ensure unique names
  //   const nameSet = new Set();
  //   for (const name of allLocations) {
  //     if (nameSet.has(name)) {
  //       return false; // Duplicate found
  //     }
  //     nameSet.add(name);
  //   }
  //   return true; 
  // }
  
}