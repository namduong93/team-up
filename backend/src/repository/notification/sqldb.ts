import { Pool } from "pg";
import { Notification } from "../../models/notification/notification.js";
import { NotificationRepository } from "../notification_repository_type.js";
import { SeatAssignment } from "../../models/team/team.js";

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
  
  notificationApproveTeamNameChange = async(compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [compId]);
    const competitionName = competitionNameResult.rows[0]?.name;

    // Notification message for approvals
    if (approveIds.length > 0) {
      const approvalMessage = `Your coach has approved your new team name for competition ${competitionName}.`;
      const approvalNotificationQuery = `
        INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
        SELECT participant AS user_id, $3, 'name'::notification_type_enum, $1, id AS team_id, NOW()
        FROM competition_teams, unnest(participants) AS participant
        WHERE competition_id = $1 
        AND id = ANY($2::int[])
      `;
      await this.pool.query(approvalNotificationQuery, [compId, approveIds, approvalMessage]);
    }

    // Notification message for rejections
    if (rejectIds.length > 0) {
      const rejectionMessage = `Your coach has rejected your new team name for competition ${competitionName}.`;
      const rejectionNotificationQuery = `
        INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
        SELECT participant AS user_id, $3, 'name'::notification_type_enum, $1, id AS team_id, NOW()
        FROM competition_teams, unnest(participants) AS participant
        WHERE competition_id = $1 
        AND id = ANY($2::int[])
      `;
      await this.pool.query(rejectionNotificationQuery, [compId, rejectIds, rejectionMessage]);
    }

    return {};
  }

  notificationRequestSiteChange = async (teamId: number, competitionId: number): Promise<{} | undefined> => {
    // Get the old site ID and the pending site ID
    const siteQuery = `
    SELECT 
      ct.site_attending_id, 
      ct.pending_site_attending_id, 
      cs_old.name AS old_site_name, 
      cs_new.name AS new_site_name, 
      ct.name
    FROM competition_teams ct
    LEFT JOIN competition_sites cs_old ON ct.site_attending_id = cs_old.id
    LEFT JOIN competition_sites cs_new ON ct.pending_site_attending_id = cs_new.id
    WHERE ct.id = $1
      AND ct.competition_id = $2
  `;
    const siteIdResult = await this.pool.query(siteQuery, [teamId, competitionId]);
    const oldSiteName = siteIdResult.rows[0]?.old_site_name;
    const newSiteName = siteIdResult.rows[0]?.new_site_name;
    const teamName = siteIdResult.rows[0]?.name;
  
    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [competitionId]);
    const competitionName = competitionNameResult.rows[0]?.name;
  
    // Create notification message
    const notificationMessage = `Team ${teamName} has requested to change site from ${oldSiteName} to ${newSiteName} for competition ${competitionName}.`;
  
    // Insert notification into the database
    const notificationQuery = `
      INSERT INTO notifications (user_id, message, type, competition_id, created_at)
      SELECT u.id AS user_id, $3, 'site'::notification_type_enum, $1, NOW()
      FROM competition_teams AS ct
      JOIN competition_users AS cu ON cu.id = ct.competition_coach_id
      JOIN users AS u ON u.id = cu.user_id
      WHERE ct.competition_id = $1
      AND ct.id = $2
    `;
    await this.pool.query(notificationQuery, [competitionId, teamId, notificationMessage]);
  
    return {};
  }

  
  
  notificationApproveSiteChange = async (compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{} | undefined> => {
    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [compId]);
    const competitionName = competitionNameResult.rows[0]?.name;

    // Notification message for approvals
    if (approveIds.length > 0) {
      const approvalMessage = `Your coach has approved your site change for competition ${competitionName}.`;
      const approvalNotificationQuery = `
        INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
        SELECT participant AS user_id, $3, 'site'::notification_type_enum, $1, id AS team_id, NOW()
        FROM competition_teams, unnest(participants) AS participant
        WHERE competition_id = $1 
        AND id = ANY($2::int[])
      `;
      await this.pool.query(approvalNotificationQuery, [compId, approveIds, approvalMessage]);
    }

    // Notification message for rejections
    if (rejectIds.length > 0) {
      const rejectionMessage = `Your coach has rejected your site change for competition ${competitionName}.`;
      const rejectionNotificationQuery = `
        INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
        SELECT participant AS user_id, $3, 'site'::notification_type_enum, $1, id AS team_id, NOW()
        FROM competition_teams, unnest(participants) AS participant
        WHERE competition_id = $1 
        AND id = ANY($2::int[])
      `;
      await this.pool.query(rejectionNotificationQuery, [compId, rejectIds, rejectionMessage]);
    }

    return {};
  }

  
  notificationApproveTeamAssignment = async(compId: number, approveIds: Array<number>): Promise<{}> => {
    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [compId]);
    const competitionName = competitionNameResult.rows[0]?.name;

    // Notification message all team members
    if (approveIds.length > 0) {
      const approvalMessage = `You have been assigned to a team for competition ${competitionName}.`;
      const approvalNotificationQuery = `
        INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
        SELECT participant AS user_id, $3, 'teamStatus'::notification_type_enum, $1, id AS team_id, NOW()
        FROM competition_teams, unnest(participants) AS participant
        WHERE competition_id = $1 
        AND id = ANY($2::int[])
      `;
      await this.pool.query(approvalNotificationQuery, [compId, approveIds, approvalMessage]);
    }

    return {};
  }

  notificationTeamSeatAssignments = async(compId: number, seatAssignments: Array<SeatAssignment>): Promise<{} | undefined> => {
    // Get the competition name
    const competitionNameQuery = `
      SELECT name 
      FROM competitions 
      WHERE id = $1
    `;
    const competitionNameResult = await this.pool.query(competitionNameQuery, [compId]);
    const competitionName = competitionNameResult.rows[0]?.name;

    for (const seatAssignment of seatAssignments) {
      const seatAssignmentMessage = `Your team has been assigned to the following seat for competition ${competitionName}: ${seatAssignment.teamSite} - ${seatAssignment.teamSeat}.`;
      const seatAssignmentNotificationQuery = `
      INSERT INTO notifications (user_id, message, type, competition_id, team_id, created_at)
      SELECT participant AS user_id, $3, 'site'::notification_type_enum, $1, id AS team_id, NOW()
      FROM competition_teams, unnest(participants) AS participant
      WHERE competition_id = $1 
      AND id = $2
      `;
      await this.pool.query(seatAssignmentNotificationQuery, [compId, seatAssignment.teamId, seatAssignmentMessage]);
    }

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