import { BAD_REQUEST } from "../controllers/controller_util/http_error_handler.js";
import { Notification } from "../models/notification/notification.js";
import { NotificationRepository } from "../repository/notification_repository_type.js";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  notificationCreate = async (notification: Notification): Promise<{} | undefined> => {
    return await this.notificationRepository.notificationCreate(notification);
  }

  notificationRemove = async (notificationId: number): Promise<{}> => {
    return await this.notificationRepository.notificationRemove(notificationId);
  }

  userNotificationsList = async (userId: number): Promise<Notification[] | undefined> => {
    const result = this.notificationRepository.userNotificationsList(userId);

    if (!result) {
      throw BAD_REQUEST;
    }

    return result;
  }
}