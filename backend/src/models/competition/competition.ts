import { CompetitionUserRole } from "./competitionUser";

export interface Competition {
  id?: number,
  name: string,
  teamSize?: number,
  earlyRegDeadline: EpochTimeStamp,
  generalRegDeadline: EpochTimeStamp,
  siteLocations?: CompetitionSiteObject[],
  otherSiteLocations?: CompetitionOtherSiteObject[],
  code?: string
}

export enum CompetitionLevel {
  LEVELA = 'A',
  LEVELB = 'B'
}

export const DEFAULT_COUNTRY = 'Australia';

export type CompetitionIdObject = { competitionId: number };

// Include both the user roles for the competition and the competition details
export type CompetitionShortDetailsObject = { 
  compId: number,
  compName: string,
  location: string,
  compDate: string,
  roles: CompetitionUserRole[]
 };

// TODO: Revise this type
export type CompetitionSiteObject = { universityId: number, name: string, capacity?: number };

export type CompetitionOtherSiteObject = { universityName: number, name: string, capacity?: number };