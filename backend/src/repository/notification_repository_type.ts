import { Notification } from "../models/notification/notification";

export interface NotificationRepository {
  notificationCreate(notification: Notification): Promise<{} | undefined>;
  notificationsList(userId: number): Promise<Array<Notification> | undefined>;
}