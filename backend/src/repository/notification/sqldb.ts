import { Pool } from "pg";
import { Notification, NotificationType } from "../../models/notification/notification";
import { NotificationRepository } from "../notification_repository_type";
import { parse } from "postgres-array";

export class SqlDbNotificationRepository implements NotificationRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  notificationCreate = async(notification: Notification): Promise<{} | undefined> => {
    return undefined;
  }

  notificationWithdrawal = async(userId: number, competitionId: number, competitionName: string, teamId: number, teamName: string): Promise<{} | undefined> => {
    // Get student's name
    const studentNameQuery = `
      SELECT name FROM users WHERE id = $1
    `;
    const studentNameResult = await this.pool.query(studentNameQuery, [userId]);
    const studentName = studentNameResult.rows[0]?.name;

    // Add notifications for other team members and the coach
    const teamMemberWithdrawalNotification = `${studentName} has withdrawn from your team from competition ${competitionName}. Please invite a substitute via your team code or wait to receive a random replacement member.`;
    const teamMembersNotificationQuery = `
      INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
      SELECT participant AS user_id, $3, 'withdrawal'::notification_type_enum, $1, $2, NOW()
      FROM competition_teams, unnest(participants) AS participant
      WHERE competition_id = $1 
      AND id = $2
    `;
    await this.pool.query(teamMembersNotificationQuery, [competitionId, teamId, teamMemberWithdrawalNotification]);
    
    const coachNotification = `${studentName} has withdrawn from team ${teamName} from competition ${competitionName}.`;
    const coachNotificationQuery = `
      INSERT INTO notifications (user_id, message, type, competition_id, created_at)
      SELECT u.id AS user_id, $3, 'withdrawal'::notification_type_enum, $1, NOW()
      FROM competition_teams AS ct
      JOIN competition_users AS cu ON cu.id = ct.competition_coach_id
      JOIN users AS u ON u.id = cu.user_id
      WHERE ct.competition_id = $1
      AND ct.id = $2
    `;
    await this.pool.query(coachNotificationQuery, [competitionId, teamId, coachNotification]);

    return {};
  }

  notificationRequestTeamNameChange = async(teamId: number, competitionId: number): Promise<{} | undefined> => {
    // Get the old team name and the pending team name
    const teamNameQuery = `
      SELECT name, pending_name 
      FROM competition_teams 
      WHERE id = $1
      AND competition_id = $2
    `;
    const teamNameResult = await this.pool.query(teamNameQuery, [teamId, competitionId]);
    const oldTeamName = teamNameResult.rows[0]?.name;
    const pendingTeamName = teamNameResult.rows[0]?.pending_name;

    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [competitionId]);
    const competitionName = competitionNameResult.rows[0]?.name;

    // Create notification message
    const notificationMessage = `Team ${oldTeamName} has requested to change its name to ${pendingTeamName} for competition ${competitionName}.`;

    // Insert notification into the database
    const notificationQuery = `
      INSERT INTO notifications (user_id, message, type, competition_id, created_at)
      SELECT u.id AS user_id, $3, 'name'::notification_type_enum, $1, NOW()
      FROM competition_teams AS ct
      JOIN competition_users AS cu ON cu.id = ct.competition_coach_id
      JOIN users AS u ON u.id = cu.user_id
      WHERE ct.competition_id = $1
      AND ct.id = $2
    `;
    await this.pool.query(notificationQuery, [competitionId, teamId, notificationMessage]);

    return {};
  }    

  userNotificationsList = async(userId: number): Promise<Array<Notification> | undefined> => {
    // TODO: add criteria to sort notifications
    const notifications = await this.pool.query(
      `SELECT id, type, message, created_at AS "createdAt", team_name as "teamName",
      student_name AS "studentName", competition_name AS "competitionName", new_team_name AS "newTeamName",
      site_location AS "siteLocation" FROM notifications WHERE user_id = $1`,
      [userId]
    );

    if (notifications.rowCount === 0) {
      return undefined;
    }

    // Parse the type to remove brackets
    const parsedNotifications = notifications.rows.map((notification: any) => {
      return {
        ...notification,
        type: notification.type.replace(/[{ }]/g, ''), // Removes curly braces
      } as Notification;
    });

    return parsedNotifications;
  }
}