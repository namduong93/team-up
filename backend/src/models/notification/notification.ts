export interface Notification {
  id?: number;
  userId: number;
  teamId?: number;
  competitionId?: number;
  type: NotificationType;
  message: string;
  decision?: DecisionType;
  createdAt: Date;
  teamName?: string;
  studentName?: string;
  competitionName?: string;
  newTeamName?: string;
  siteLocation?: string;
}

export enum NotificationType {
  WELCOME_ACCOUNT = 'welcomeAccount',
  WELCOME_COMPETITION = 'welcomeCompetition',
  WITHDRAWL = 'withdrawal',
  NAME = 'name',
  SITE = 'site',
  DEADLINE = 'deadline',
  TEAM_STATUS = 'teamStatus',
  CHEER = 'cheer',
  INVITE = 'invite',
}

export const enum DecisionType {
  SUBSTITUTION = 'substitution',
  REPLACEMENT = 'replacement',
}