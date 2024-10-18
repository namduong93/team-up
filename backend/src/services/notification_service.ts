import { Notification } from "../models/notification/notification";
import { NotificationRepository } from "../repository/notification_repository_type";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  notificationCreate = async (notification: Notification): Promise<{} | undefined> => {
    return await this.notificationRepository.notificationCreate(notification);
  }

  notificationsList = async (userId: number): Promise<Notification[] | undefined> => {
    return await this.notificationRepository.notificationsList(userId);
  }
}