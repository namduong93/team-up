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

export interface CompetitionStudentDetails {
  name: string;
  email: string;
  preferredContact: string;
  image?: string;
  competitionBio: string;
  competitionLevel: string;
  ICPCEligible: boolean;
  boersenEligible: boolean;
  degreeYear: number;
  degree: string;
  isRemote: boolean;
  nationalPrizes?: string;
  internationalPrizes: string;
  codeforcesRating?: number;
  universityCourses: string[];
  pastRegional?: boolean;
}

export const enum CompetitionUserRole {
  PARTICIPANT = 'Participant',
  COACH = 'Coach',
  ADMIN = 'Admin',
  SITE_COORDINATOR = 'Site-Coordinator'
}