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

export type CompetitionIdObject = { competitionId: number };

// Include both the user roles for the competition and the competition details
export type CompetitionShortDetailsObject = { userType: Array<CompetitionUserRole>, competition: Competition };

// TODO: Revise this type
export type CompetitionSiteObject = { universityId: number, name: string, capacity?: number };

export type CompetitionOtherSiteObject = { universityName: number, name: string, capacity?: number };