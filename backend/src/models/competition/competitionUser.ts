export interface CompetitionUser {
  userId?: number;
  competitionId: number;
  competitionRoles: Array<CompetitionUserRole>;
  ICPCEligible: boolean;
  competitionLevel: string;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  nationalPrizes: string;
  internationalPrizes: string;
  codeforcesRating: number;
  universityCourses: string[];
  pastRegional: boolean;
}

export const enum CompetitionUserRole {
  PARTICIPANT = 'participant',
  COACH = 'coach',
  ADMIN = 'admin',
  SITE_COORDINATOR = 'site_coordinator'
}