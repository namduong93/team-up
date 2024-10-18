export interface Notification {
  id?: number;
  userId?: number;
  competitionId: number;
  type: NotificationType;
  message: string;
  decision?: DecisionType;
  date: Date;
  teamName?: string;
  studentName?: string;
  competitionName?: string;
  newTeamName?: string;
  siteLocation?: string;
}

export const enum NotificationType {
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