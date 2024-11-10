import { BAD_REQUEST, COMPETITION_ADMIN_REQUIRED, COMPETITION_NOT_FOUND, COMPETITION_USER_REGISTERED } from "../controllers/controller_util/http_error_handler.js";
import { ServiceError, ServiceErrorType } from "../errors/service_error.js";
import { DbError } from "../errors/db_error.js";
import { Competition, CompetitionIdObject, CompetitionShortDetailsObject, CompetitionSiteObject } from "../models/competition/competition.js";
import { CompetitionStaff, CompetitionUser, CompetitionUserRole } from "../models/competition/competitionUser.js";
import { UserType } from "../models/user/user.js";
import { CompetitionRepository } from "../repository/competition_repository_type.js";
import { NotificationRepository } from "../repository/notification_repository_type.js";
import { UserRepository } from "../repository/user_repository_type.js";
import { SeatAssignment } from "../models/team/team.js";
import { TeamDetails } from "../../shared_types/Competition/team/TeamDetails.js";
import { StudentInfo } from "../../shared_types/Competition/student/StudentInfo.js";
import { StaffInfo } from "../../shared_types/Competition/staff/StaffInfo.js";
import { CompetitionRole } from "../../shared_types/Competition/CompetitionRole.js";

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

export interface TeamMateData {
  teamMateEmail: string;
  teamMateName: string;
  teamMateICPCEmail: string;
  teamMateDegreeYear: number;
  teamMateDegree: string;
};


export class CompetitionService {
  private competitionRepository: CompetitionRepository;
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  
  constructor(competitionRepository: CompetitionRepository, userRepository: UserRepository, notificationRepository: NotificationRepository) {
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Updates the competition user details for a list of staff in a specific competition.
   *
   * @param userId The ID of the user making the request.
   * @param staffList An array of staff information to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is not an Admin for the competition.
   * @returns A promise that resolves when the update is complete.
   */
  competitionStaffUpdate = async (userId: number, staffList: StaffInfo[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth, 'User is not an Admin for this competition');
    }

    await this.competitionRepository.competitionStaffUpdate(userId, staffList, compId);
    return;
  }


  /**
   * Updates the competition user details for a list of students in a specific competition.
   * 
   * @param userId The ID of the user performing the update.
   * @param studentList An array of student information objects to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is neither an Admin nor a Coach.
   * @returns A promise that resolves when the update is complete.
   */
  competitionStudentsUpdate = async (userId: number, studentList: StudentInfo[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or Coach');
      }

      await this.competitionRepository.coachCheckIdsStudent(userId, studentList.map((student) => student.userId), compId);
    }

    await this.competitionRepository.competitionStudentsUpdate(userId, studentList, compId);
    return;
  }

  /**
   * Updates the details of teams in a competition.
   *
   * @param userId The ID of the user making the request.
   * @param teamList An array of team details to be updated.
   * @param compId The ID of the competition.
   * @throws {ServiceError} If the user is not an Admin or Coach.
   * @returns A promise that resolves when the update is complete.
   */
  competitionTeamsUpdate = async (userId: number, teamList: TeamDetails[], compId: number) => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      if (!roles.includes(CompetitionUserRole.COACH)) {
        throw new ServiceError(ServiceError.Auth, 'User is not an Admin or Coach');
      }

      await this.competitionRepository.coachCheckIds(userId, teamList.map((team) => team.teamId), compId);

    }


    await this.competitionRepository.competitionTeamsUpdate(teamList, compId);
    return;
  }
  
  competitionSitesCodes = async (code: string) => {
    const compId = await this.competitionRepository.competitionIdFromCode(code);

    return await this.competitionSites(compId);
  }

  /**
   * Retrieves the competition sites for a given competition ID.
   *
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the competition sites.
   */
  competitionSites = async (compId: number) => {
    return await this.competitionRepository.competitionSites(compId);
  }
  
  /**
   * Retrieves the attendees of a competition for a given user.
   * 
   * @param userId The ID of the user requesting the attendees.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the list of competition attendees.
   * @throws {ServiceError} If the user does not have the required role (SITE_COORDINATOR or ADMIN).
   */
  competitionAttendees = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.SITE_COORDINATOR) && !roles.includes(CompetitionUserRole.ADMIN)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/attendees route is only for site coordinators and admins to use');
    }

    return await this.competitionRepository.competitionAttendees(userId, compId);
  }

  /**
   * Retrieves the details of a competition team for a given user.
   * 
   * @param userId The ID of the user requesting the team details.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the competition team details.
   * @throws {ServiceError} If the user is not a participant in the competition.
   */
  competitionTeamDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'competition/team/details route is only for participants to use');
    }

    return await this.competitionRepository.competitionTeamDetails(userId, compId);
  }

  /**
   * Generates an invite code for a team in a competition.
   *
   * @param userId The ID of the user requesting the invite code.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the invite code for the team.
   * @throws {ServiceError} If the user is not a participant in the competition.
   */
  competitionTeamInviteCode = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'User is not a participant for this competition.');
    }
    return await this.competitionRepository.competitionTeamInviteCode(userId, compId);
  }

  /**
   * Allows a user to join a competition team using a team code.
   * 
   * @param userId The ID of the user attempting to join the team.
   * @param compId The ID of the competition.
   * @param teamCode The code of the team the user is attempting to join.
   * @returns A promise that resolves when the user successfully joins the team.
   * @throws {ServiceError} If the user is not a participant in the competition.
   * @throws {ServiceError} If the user is not part of a university.
   */
  competitionTeamJoin = async (userId: number, compId: number, teamCode: string) => { 
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth,
        'User is not a participant for this competition.');
    }
    const university = await this.userRepository.userUniversity(userId);
    if (!university) {
      throw new ServiceError(ServiceError.NotFound, 'User is not a part of an university');
    }
    return await this.competitionRepository.competitionTeamJoin(userId, compId, teamCode, university);
  }

  /**
   * Retrieves the details of a student participating in a competition.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the competition student details.
   * @throws {ServiceError} If the user is not a participant in the competition.
   */
  competitionStudentDetails = async (userId: number, compId: number) => {
    const roles = await this.competitionRoles(userId, compId);
    if (!roles.includes(CompetitionUserRole.PARTICIPANT)) {
      throw new ServiceError(ServiceError.Auth, "User is not a participant for this competition.");
    }

    return await this.competitionRepository.competitionStudentDetails(userId, compId);
  }

  /**
   * Retrieves the staff information for a specific competition.
   *
   * @param userId The ID of the user requesting the staff information.
   * @param compId The ID of the competition for which the staff information is requested.
   * @returns A promise that resolves to an array of StaffInfo objects.
   */
  competitionStaff = async (userId: number, compId: number): Promise<Array<StaffInfo>> => {
    return await this.competitionRepository.competitionStaff(userId, compId);
  }

  /**
   * Retrieves a list of students participating in a specific competition.
   *
   * @param userId The ID of the user requesting the information.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of `StudentInfo` objects.
   */
  competitionStudents = async (userId: number, compId: number): Promise<Array<StudentInfo>> => {
    return await this.competitionRepository.competitionStudents(userId, compId);
  }

  /**
   * Retrieves the roles of a user in a specific competition.
   *
   * @param userId The ID of the user whose roles are being retrieved.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the roles of the user in the competition.
   */
  competitionRoles = async (userId: number, compId: number) => {
    return await this.competitionRepository.competitionRoles(userId, compId);
  }
  
  /**
   * Retrieves the teams participating in a competition for a given user (staff).
   *
   * @param userId The ID of the user requesting the competition teams.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the list of teams in the competition.
   */
  competitionTeams = async (userId: number, compId: number) => {
    return await this.competitionRepository.competitionTeams(userId, compId);
  }

  /**
   * Creates a new competition as a system administrator.
   *
   * @param userId The ID of the user attempting to create the competition.
   * @param competition The competition details to be created.
   * @returns A promise that resolves to an object containing the ID of the created competition.
   * @throws {ServiceError} If the user is not a system administrator.
   */
  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User is not a system admin.');
    }
    
    const competitionId = await this.competitionRepository.competitionSystemAdminCreate(userId, competition);

    return competitionId;
  }

  /**
   * Updates a competition's details by a system admin.
   *
   * @param userId The ID of the user attempting to perform the update.
   * @param competition The competition object containing updated details.
   * @returns A promise that resolves to the updated competition ID or undefined.
   * @throws {ServiceError} If the user is not a system admin.
   */
  competitionSystemAdminUpdate = async (userId: number, competition: Competition): Promise<{} | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw new ServiceError(ServiceError.Auth, 'User is not a system admin.');
    }

    const competitionId = await this.competitionRepository.competitionSystemAdminUpdate(userId, competition);
    
    return competitionId;
  }

  /**
   * Retrieves the details of a competition by its ID.
   *
   * @param competitionId - The ID of the competition to retrieve details for.
   * @returns A promise that resolves to the details of the competition.
   * @throws {ServiceError} If the competition ID is not provided or the competition is not found.
   */
  competitionGetDetails = async (competitionId: number): Promise<Competition> => {
    if (!competitionId) {
      throw new ServiceError(ServiceError.NotFound, 'Competition not found');
    }
    
    const competitionDetails = await this.competitionRepository.competitionGetDetails(competitionId);
    
    return competitionDetails;
  }

  /**
   * Retrieves a list of competitions that the user is a part of.
   *
   * @param userId The ID of the user for whom to retrieve the competitions.
   * @returns A promise that resolves to an array of CompetitionShortDetailsObject or undefined if no competitions are found.
   */
  competitionsList = async (userId: number): Promise<Array<CompetitionShortDetailsObject> | undefined> => {
    // Get user type for easier database queries
    const userTypeObject = await this.userRepository.userType(userId);

    const competitions = await this.competitionRepository.competitionsList(userId, userTypeObject.type);
    
    return competitions;
  }

  /**
   * Checks if a competition code is valid.
   * 
   * @param userId The ID of the user to check.
   * @param code The competition code to validate.
   * @returns An empty object if the user can register for the competition, or undefined.
   * @throws {COMPETITION_NOT_FOUND} - If the competition code does not correspond to any competition.
   * @throws {COMPETITION_USER_REGISTERED} - If the user is already registered as a participant or staff.
   */
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

  /**
   * Retrieves the default site for a user in a competition based on their university.
   *
   * @param userId The ID of the user.
   * @param code The code of the competition.
   * @returns A promise that resolves to the default competition site object for the user's university, or undefined if not found.
   * @throws {ServiceError} If the competition is not found or the user is not associated with a university.
   */
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


  /**
   * Allows a student to join a competition using a provided code.
   * 
   * @param code The code of the competition to join.
   * @param competitionUserInfo The information of the user attempting to join the competition.
   * @throws {ServiceError} If the user is not a student.
   * @throws {ServiceError} If the competition is not found.
   * @throws {ServiceError} If the user is already a participant or staff for the competition.
   * @throws {ServiceError} If the user's university is not found.
   * @throws {ServiceError} If the site location is not provided.
   * @returns {Promise<void>} A promise that resolves when the user has successfully joined the competition.
   */
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

  /**
   * Withdraws a student from a competition.
   *
   * @param userId The ID of the user to withdraw.
   * @param compId The ID of the competition to withdraw from.
   * @returns A promise that resolves to the competition code if the withdrawal is successful, or undefined otherwise.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
  competitionStudentWithdraw = async (userId: number, compId: number): Promise<string | undefined> => {
    // Check if user is a student or a participant
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type !== UserType.STUDENT) {
      throw new ServiceError(ServiceError.Auth, 'User is not a student.');
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

  /**
   * Approves team assignments for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the approval.
   * @param compId The ID of the competition.
   * @param approveIds An array of team assignment IDs to approve.
   * @returns A promise that resolves to an empty object.
   */
  competitionApproveTeamAssignment = async (userId: number, compId: number, approveIds: Array<number>): Promise<{}> => {
    // Checks for if user is admin or coach is moved to repository layer

    // Approve team assignments
    await this.competitionRepository.competitionApproveTeamAssignment(userId, compId, approveIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamAssignment(compId, approveIds);

    return {};
  }

  /**
   * Requests a team name change for a competition and notifies the coach
   *
   * @param userId The ID of the user requesting the change.
   * @param compId The ID of the competition.
   * @param newTeamName The new team name being requested.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
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

  /**
   * Approves or rejects team name change requests for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of team IDs whose name change requests are approved.
   * @param rejectIds An array of team IDs whose name change requests are rejected.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionApproveTeamNameChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Approve or reject team name change
    await this.competitionRepository.competitionApproveTeamNameChange(userId, compId, approveIds, rejectIds);

    // Notify team members
    await this.notificationRepository.notificationApproveTeamNameChange(compId, approveIds, rejectIds);

    return {};
  }

  /**
   * Requests a site change for a competition participant and notifies the coach.
   *
   * @param userId The ID of the user requesting the site change.
   * @param compId The ID of the competition.
   * @param newSiteId The ID of the new site being requested.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the user is not a student or not a participant in the competition.
   */
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

  /**
   * Approves or rejects site ID changes for a competition and notifies team members.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of IDs to approve.
   * @param rejectIds An array of IDs to reject.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionApproveSiteChange = async (userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Approve or reject site ID change
    await this.competitionRepository.competitionApproveSiteChange(userId, compId, approveIds, rejectIds);
  
    // Notify team members
    await this.notificationRepository.notificationApproveSiteChange(compId, approveIds, rejectIds);
  
    return {};
  }

  /**
   * Assigns seats to teams in a competition and sends notifications to the teams.
   *
   * @param userId The ID of the user performing the assignment.
   * @param compId The ID of the competition.
   * @param seatAssignments An array of seat assignments for the teams.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionTeamSeatAssignments = async (userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{} | undefined> => {
    // Assign seats to teams
    await this.competitionRepository.competitionTeamSeatAssignments(userId, compId, seatAssignments);

    // Notifications to teams
    await this.notificationRepository.notificationTeamSeatAssignments(compId, seatAssignments);
  
    return {};
  }

  /**
   * Registers teams for a competition.
   *
   * @param userId The ID of the user performing the registration.
   * @param compId The ID of the competition.
   * @param teamIds An array of team IDs to be registered.
   * @returns A promise that resolves to an empty object or undefined.
   */
  competitionRegisterTeams = async (userId: number, compId: number, teamIds: Array<number>): Promise<{} | undefined> => {
    await this.competitionRepository.competitionRegisterTeams(userId, compId, teamIds);
    return {};
  }

  /**
   * Adds a staff member to a competition based on the provided competition code and staff information.
   * 
   * @param code The unique code of the competition.
   * @param competitionStaffInfo An object containing information about the competition staff member.
   * @returns A promise that resolves to an empty object or undefined.
   * @throws {ServiceError} If the competition is not found.
   * @throws {ServiceError} If the user is not a staff member.
   * @throws {ServiceError} If the competition bio is not provided for a coach role.
   * @throws {ServiceError} If the user is not associated with a university.
   * @throws {ServiceError} If the site location, name, or capacity is not provided for a site coordinator role.
   */
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