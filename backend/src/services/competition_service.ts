import { BAD_REQUEST, COMPETITION_ADMIN_REQUIRED, COMPETITION_CODE_EXISTED, COMPETITION_NOT_FOUND, COMPETITION_STUDENT_REQUIRED, COMPETITION_USER_REGISTERED } from "../controllers/controller_util/http_error_handler.js";
import { ServiceError, ServiceErrorType } from "../errors/service_error.js";
import { DbError } from "../errors/db_error.js";
import { Competition, CompetitionIdObject, CompetitionShortDetailsObject, CompetitionSiteObject } from "../models/competition/competition.js";
import { CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { UserType } from "../models/user/user.js";
import { CompetitionRepository, CompetitionRole } from "../repository/competition_repository_type.js";
import { NotificationRepository } from "../repository/notification_repository_type.js";
import { UserRepository } from "../repository/user_repository_type.js";
import { SeatAssignment } from "../models/team/team.js";

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


export interface MemberDetails {
  name: string;
  siteId: number;
  ICPCEligible: boolean;
  level: string;
  boersenEligible: boolean;
  isRemote: boolean
};

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
}
export interface TeamDetails extends ParticipantTeamDetails {
  teamId: number;
  universityId: number;
  status: 'Pending' | 'Registered' | 'Unregistered';
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

enum StaffAccess {
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
    userId: number;
    name: string;
    email: string;
    bio: string;
    preferredContact: string;
    siteId: number;
    ICPCEligible: boolean;
    level: string;
    boersenEligible: boolean;
    isRemote: boolean;
  }>;
  coach: {
    name: string;
    email: string;
    bio: string;
  }
}

export interface AttendeesDetails {
  userId: number;
  universityId: number;
  siteId: number;
  pendingSiteId: number;
  email: string;
  
  name: string;
  sex: string;
  roles: Array<CompetitionRole>;
  universityName: string;
  shirtSize: string;
  dietaryNeeds: string | null;
  allergies: string | null;
  accessibilityNeeds: string | null;
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
  
  competitionSitesCodes = async (code: string) => {
    const compId = await this.competitionRepository.competitionIdFromCode(code);

    return await this.competitionSites(compId);
  }

  competitionSites = async (compId: number) => {
    return await this.competitionRepository.competitionSites(compId);
  }
  
  competitionAttendees = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.SITE_COORDINATOR) && !roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/attendees route is only for site coordinators and admins to use');
    }

    return await this.competitionRepository.competitionAttendees(userId, compId);
  }

  competitionTeamDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/team/details route is only for participants to use');
    }

    return await this.competitionRepository.competitionTeamDetails(userId, compId);
  }

  competitionStudentDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, "User is not a participant for this competition.");
    }

    return await this.competitionRepository.competitionStudentDetails(userId, compId);
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
      throw new ServiceError(ServiceError.Auth, 'User is not a system admin.');
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
    // const userTypeObject = await this.userRepository.userType(userId);
    // if (userTypeObject.type !== UserType.STUDENT) {
    //   throw COMPETITION_STUDENT_REQUIRED;
    // }

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

  competitionUserDefaultSite = async (userId: number, code: string): Promise< CompetitionSiteObject | undefined> => {
    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    const university = await this.userRepository.userUniversity(userId);
    if (!university) {
      throw new ServiceError(ServiceError.NotFound, 'User is not associated with a university');
    }
    const defaultSite = await this.competitionRepository.competitionUniversityDefaultSite(competitionId, university);
    return defaultSite;
   }


  competitionStudentJoin = async (code: string, competitionUserInfo: CompetitionUser): Promise<void> => {
    const userTypeObject = await this.userRepository.userType(competitionUserInfo.userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
    }

    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }

    competitionUserInfo.competitionId = competitionId;
    const competitionRoles = await this.competitionRepository.competitionRoles(competitionUserInfo.userId, competitionId);
    if (competitionRoles.length > 0) { // either they are already a participant or a staff
      throw new ServiceError(ServiceError.Auth, 'User is already a participant or staff for this competition.');
    }
    competitionUserInfo.competitionRoles = [CompetitionUserRole.PARTICIPANT];

    const university = await this.userRepository.userUniversity(competitionUserInfo.userId);
    if(!university) {
      throw new ServiceError(ServiceError.NotFound, 'University not found');
    }

    if(!competitionUserInfo.siteLocation || !competitionUserInfo.siteLocation.id) {
      throw new ServiceError(ServiceError.NotFound, 'Site location not provided');
    }

    await this.competitionRepository.competitionStudentJoin(competitionUserInfo, university);
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

  competitionApproveTeamAssignment = async (userId: number, compId: number, approveIds: Array<number>): Promise<{}> => {
    // Checks for if user is admin or coach is moved to repository layer

    // Approve team assignments
    await this.competitionRepository.competitionApproveTeamAssignment(userId, compId, approveIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamAssignment(compId, approveIds);

    return {};
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
    // Approve or reject team name change
    await this.competitionRepository.competitionApproveTeamNameChange(userId, compId, approveIds, rejectIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamNameChange(compId, approveIds, rejectIds);

    return {};
  }

  competitionRequestSiteChange = async (userId: number, compId: number, newSiteId: number): Promise<{} | undefined> => {
    // Check if user is a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, "User is not a student.");
    }
  
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, "User is not a participant for this competition.");
    }
  
    // Request site ID change
    const teamId = await this.competitionRepository.competitionRequestSiteChange(userId, compId, newSiteId);
  
    // Notify coach
    await this.notificationRepository.notificationRequestSiteChange(teamId, compId);
  
    return {};
  }

  competitionApproveSiteChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Approve or reject site ID change
    await this.competitionRepository.competitionApproveSiteChange(userId, compId, approveIds, rejectIds);
  
    // Notify team members
    await this.notificationRepository.notificationApproveSiteChange(compId, approveIds, rejectIds);
  
    return {};
  }

  competitionTeamSeatAssignments = async (userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{} | undefined> => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.SITE_COORDINATOR) && !roles.includes(CompetitionUserRole.COACH) && !roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth, "User is not a staff for this competition.");
    }

    // Assign seats to teams
    await this.competitionRepository.competitionTeamSeatAssignments(seatAssignments);

    // Notifications to teams
    await this.notificationRepository.notificationTeamSeatAssignments(compId, seatAssignments);
  
    return {};
  }

  competitionStaffJoin = async (code: string, competitionStaffInfo: CompetitionStaff ): Promise<{} | undefined> => {
    const competitionId = await this.competitionRepository.competitionIdFromCode(code);
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }
    let userType = await this.userRepository.userType(competitionStaffInfo.userId);
    if(userType.type === UserType.STUDENT) {
      throw new ServiceError(ServiceError.NotFound, 'User not staff');
    }
    if(competitionStaffInfo.competitionRoles.includes(CompetitionUserRole.COACH)) {
      if(!competitionStaffInfo.competitionBio) {
        throw new ServiceError(ServiceError.NotFound, 'Competition bio not provided');
      }
      const university = await this.userRepository.userUniversity(competitionStaffInfo.userId);
      if (!university) {
        throw new ServiceError(ServiceError.NotFound, 'User is not associated with this university');
      }
      competitionStaffInfo.university = university;
    }

    if(competitionStaffInfo.competitionRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      if(!competitionStaffInfo.siteLocation || !competitionStaffInfo.siteLocation.id) {
        throw new ServiceError(ServiceError.NotFound, 'Site location not provided');
      }
      if(!competitionStaffInfo.siteLocation.name) {
        throw new ServiceError(ServiceError.NotFound, 'Site name not provided');
      }
      if(!competitionStaffInfo.siteLocation.capacity) {
        throw new ServiceError(ServiceError.NotFound, 'Site capacity not provided');
      }
    }

    await this.competitionRepository.competitionStaffJoin(competitionId, competitionStaffInfo);
    return {};
  }

  competitionUniversitiesList = async (competitionId: number): Promise<Array<UniversityDisplayInfo> | undefined> => {

    return [{ id: 1, name: 'Macquarie University' }]
  }

  competitionAlgorithm = async (compId: number, userId: number): Promise<{}> => {
    const competition = await this.competitionRepository.competitionGetDetails(compId);
    if (!competition) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.COACH)) {
      throw new ServiceError(ServiceError.Auth, 'User is not a coach');
    }
    const teamsParticipating = await this.competitionRepository.competitionAlgorithm(compId, userId);
    return teamsParticipating;
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