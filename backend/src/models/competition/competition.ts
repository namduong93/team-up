import { CompetitionUserRole } from "./competitionUser";

export interface Competition {
  id?: number,
  name: string,
  teamSize?: number,
  createdDate: EpochTimeStamp,
  earlyRegDeadline: EpochTimeStamp,
  startDate: EpochTimeStamp;
  generalRegDeadline: EpochTimeStamp,
  siteLocations?: CompetitionSiteObject[],
  otherSiteLocations?: CompetitionOtherSiteObject[],
  code?: string,
  region: string,
  information?: string,
}

export enum CompetitionLevel {
  LEVELA = 'Level A',
  LEVELB = 'Level B',
  NOPREFERENCE = 'No Preference'
}

export const DEFAULT_COUNTRY = 'Australia';

export type CompetitionIdObject = { competitionId: number };

// Include both the user roles for the competition and the competition details
export type CompetitionShortDetailsObject = { 
  compId: number,
  compName: string,
  location: string,
  compDate: string,
  roles: CompetitionUserRole[],
  compCreatedDate: string
 };

// TODO: Revise this type
export type CompetitionSiteObject = { id: number, name: string, universityId?: number, capacity?: number };

export type CompetitionOtherSiteObject = { universityName: number, name: string, capacity?: number };

export type CompetitionTeamNameObject = { teamName: string };

// A return object for the competition withdrawal that gives competition code to return to frontend and compName, teamId, and teamName to generate relevant notifications
export type CompetitionWithdrawalReturnObject = { competitionCode: string, competitionName: string, teamId: number, teamName: string };