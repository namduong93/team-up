import { Notification } from "../models/notification/notification";
import { SeatAssignment } from "../models/team/team";

export interface NotificationRepository {
  notificationCreate(notification: Notification): Promise<{} | undefined>;

  notificationWithdrawal(userId: number, competitionId: number, competitionName: string, teamId: number, teamName: string): Promise<{} | undefined>;
  
  notificationApproveTeamAssignment(compId: number, approveIds: Array<number>): Promise<{}>;
  notificationRequestTeamNameChange(userId: number, competitionId: number): Promise<{}>;
  notificationApproveTeamNameChange(compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}>;
  notificationRequestSiteChange(userId: number, competitionId: number): Promise<{}>;
  notificationApproveSiteChange(compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}>;
  notificationTeamSeatAssignments(compId: number, seatAssignments: Array<SeatAssignment>): Promise<{}>;

  notificationRemove(notificationId: number): Promise<{}>;

  userNotificationsList(userId: number): Promise<Array<Notification> | undefined>;
}