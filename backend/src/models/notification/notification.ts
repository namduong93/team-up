export interface Notification {
  id?: number;
  userId: number;
  teamId?: number;
  competitionId?: number;
  type: NotificationType;
  message: string;
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