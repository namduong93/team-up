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
  PENDING = 'Pending',
  REGISTERED = 'Registered',
  UNREGISTERED = 'Unregistered'
}

export interface SeatAssignment {
  siteId: string; // ID of the site
  teamSite: string; // e.g. "CSE Building K17"
  teamSeat: string; // e.g. "Bongo01"
  teamId: string; // ID of team who have been assigned that seat
  teamName: string; // name of team at the assigned seat
  teamLevel: string; // level of the team
}

export const DEFAULT_TEAM_SIZE = 3;