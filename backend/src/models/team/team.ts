import { CompetitionUser } from "../competition/competitionUser";

export interface Team {
  id?: number;
  name: string;
  teamStatus: TeamStatus;
  teamNameApproved: boolean;
  teamSize: number;
  participants: Array<CompetitionUser>;
  universityId: number;
  competitionId: number;
}

export const enum TeamStatus {
  PENDING = 'pending',
  REGISTERED = 'registered',
  UNREGISTERED = 'unrejected'
}

export const DEFAULT_TEAM_SIZE = 3;