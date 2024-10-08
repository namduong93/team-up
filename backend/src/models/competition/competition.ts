
export interface Competition {
  id: number,
  name: string,
  teamSize: number,
  earlyRegDeadline: EpochTimeStamp,
  generalRegDeadline: EpochTimeStamp,
  code: string
}

export const enum CompetitionUserType {
  STUDENT = 'student',
  COACH = 'coach',
  SITE_COORDINATOR = 'site_coordinator',
  SYSTEM_ADMIN = 'system_admin'
}