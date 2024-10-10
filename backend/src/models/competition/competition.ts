
export interface Competition {
  id?: number,
  name: string,
  teamSize?: number,
  earlyRegDeadline: EpochTimeStamp,
  generalRegDeadline: EpochTimeStamp,
  siteLocations: CompetitionSiteObject[],
  code?: string
}

export const enum CompetitionUserType {
  PARTICIPANT = 'participant',
  COACH = 'coach',
  SITE_COORDINATOR = 'site_coordinator',
  SYSTEM_ADMIN = 'system_admin'
}

export type CompetitionIdObject = { competitionId: number };

// Include both the user roles for the competition and the competition details
export type CompetitionDetailsObject = { userType: CompetitionUserType[], competition: Competition };

// TODO: Revise this type
export type CompetitionSiteObject = { universityId: number, name: string, address?: string, capacity?: number };