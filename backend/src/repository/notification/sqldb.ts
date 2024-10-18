import { Pool } from "pg";
import { Notification } from "../../models/notification/notification";
import { NotificationRepository } from "../notification_repository_type";

export class SqlDbNotificationRepository implements NotificationRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  notificationCreate = async(notification: Notification): Promise<{} | undefined> => {
    return undefined;
  }

  notificationsList = async(userId: number): Promise<Notification[] | undefined> => {
    throw new Error("Method not implemented.");
  }
}