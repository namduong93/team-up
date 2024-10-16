
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

export interface CompetitionDetails {
  id?: number,
  name: string,
  teamSize: number,
  earlyRegDeadline: EpochTimeStamp,
  generalRegDeadline: EpochTimeStamp,
  siteLocations: CompetitionSiteObject[],
  code: string
}

export const enum CompetitionUserType {
  PARTICIPANT = 'participant',
  COACH = 'coach',
  SITE_COORDINATOR = 'site_coordinator',
  ADMIN = 'admin'
}

export type CompetitionIdObject = { competitionId: number };

// Include both the user roles for the competition and the competition details
export type CompetitionShortDetailsObject = { userType: Array<CompetitionUserType>, competition: CompetitionDetails };

// TODO: Revise this type
export type CompetitionSiteObject = { universityId: number, name: string, address?: string, capacity?: number };

export type CompetitionOtherSiteObject = { universityName: number, name: string, address?: string, capacity?: number };