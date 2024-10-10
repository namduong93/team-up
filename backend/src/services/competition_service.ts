import { BAD_REQUEST, INVALID_TOKEN } from "../controllers/controller_util/http_error_handler.js";
import { Competition, CompetitionIdObject, CompetitionSiteObject } from "../models/competition/competition.js";
import { UserType } from "../models/user/user.js";
import { CompetitionRepository } from "../repository/competition_repository_type.js";
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

export interface TeamInfo {
  teamName: string;
  competitionLevel: string;
  ICPCEligible: string;
  boersenEligible: string;
  isRemote: boolean;
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

  constructor(competitionRepository: CompetitionRepository, userRepository: UserRepository) {
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
  }

  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw INVALID_TOKEN;
    }
    
    const competitionId = await this.competitionRepository.competitionSystemAdminCreate(userId, competition);
    
    return competitionId;
  }

  competitionSystemAdminUpdate = async (userId: number, competition: Competition): Promise<{} | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);
    
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw INVALID_TOKEN;
    }
    
    const competitionId = await this.competitionRepository.competitionSystemAdminUpdate(userId, competition);

    // TODO: Handle different HTTP status codes after updating error handling
    if (!competitionId) {
      throw BAD_REQUEST;
    }
    
    return competitionId;
  }

  competitionsSystemAdminList = async (userId: number): Promise<Array<Competition> | undefined> => {
    // Verify system admin
    const userTypeObject = await this.userRepository.userType(userId);

    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw INVALID_TOKEN;
    }

    const competitions = await this.competitionRepository.competitionsSystemAdminList(userId);
    return competitions;
  }

  competitionStudentJoin0 = async (sessionToken: string, code: string, individualInfo: IndividualTeamInfo): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin1 = async (sessionToken: string, code: string, individualInfo: IndividualTeamInfo, teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionToken: string, code: string, teamInfo: TeamInfo,
    teamMate1: TeamMateData, teamMate2: TeamMateData ): Promise<TeamIdObject | undefined> => {

    return { teamId: 1 };
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
  
}