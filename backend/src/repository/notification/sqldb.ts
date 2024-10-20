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

  userNotificationsList = async(userId: number): Promise<Array<Notification> | undefined> => {
    // TODO: add criteria to sort notifications
    const notifications = await this.pool.query(
      `SELECT id, type, message, decision, created_at AS "createdAt", team_name as "teamName",
      student_name AS "studentName", competition_name AS "competitionName", new_team_name AS "newTeamName",
      site_location AS "siteLocation" FROM notifications WHERE user_id = $1`,
      [userId]
    );

    if (notifications.rowCount === 0) {
      return undefined;
    }

    return notifications.rows;
  }
}