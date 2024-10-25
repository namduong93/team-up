import { Notification } from "../models/notification/notification";

export interface NotificationRepository {
  notificationCreate(notification: Notification): Promise<{} | undefined>;

  notificationWithdrawal(userId: number, competitionId: number, competitionName: string, teamId: number, teamName: string): Promise<{} | undefined>;
  notificationRequestTeamNameChange(userId: number, competitionId: number): Promise<{} | undefined>;
  notificationApproveTeamNameChange(compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined>;

  userNotificationsList(userId: number): Promise<Array<Notification> | undefined>;
}