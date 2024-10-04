import { CompetitionRepository } from "../repository/competition_repository_type.js";

export type CompetitionCodeObject = { code: string };
export type UniversitySiteInput = { universityId: number, defaultSite: string };
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

  constructor(competitionRepository: CompetitionRepository) {
    this.competitionRepository = competitionRepository;
  }

  competitionsSystemAdminCreate = async (sessionId: string, name: string,
    earlyRegDeadline: EpochTimeStamp, generalRegDeadline: EpochTimeStamp,
    siteLocations: Array<UniversitySiteInput>): Promise<CompetitionCodeObject | undefined> => {

    // Once the competition is created return the code of it
    return { code: 'REG12345' };
  }

  competitionStudentJoin0 = async (sessionId: string, code: string, individualInfo: IndividualTeamInfo): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin1 = async (sessionId: string, code: string, individualInfo: IndividualTeamInfo, teamMate1: TeamMateData): Promise<IncompleteTeamIdObject | undefined> => {

    return { incompleteTeamId: 1 };
  }

  competitionStudentJoin2 = async (sessionId: string, code: string, teamInfo: TeamInfo,
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