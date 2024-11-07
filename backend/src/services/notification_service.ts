import { BAD_REQUEST } from "../controllers/controller_util/http_error_handler.js";
import { Notification } from "../models/notification/notification.js";
import { UserType } from "../models/user/user.js";
import { NotificationRepository } from "../repository/notification_repository_type.js";
import { UserRepository } from "../repository/user_repository_type.js";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor(notificationRepository: NotificationRepository, userRepository: UserRepository) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  notificationCreate = async (notification: Notification): Promise<{} | undefined> => {
    return await this.notificationRepository.notificationCreate(notification);
  }

  notificationRemove = async (notificationId: number): Promise<{}> => {
    return await this.notificationRepository.notificationRemove(notificationId);
  }

  userNotificationsList = async (userId: number): Promise<Notification[] | undefined> => {
    // Fetch admin notifications for pending staff approval if user is a system admin
    const userTypeObject = await this.userRepository.userType(userId);
    if (userTypeObject.type === UserType.SYSTEM_ADMIN) {
      await this.notificationRepository.notificationPendingStaffApproval(userId);
    }
    
    const result = this.notificationRepository.userNotificationsList(userId);

    if (!result) {
      throw BAD_REQUEST;
    }

    return result;
  }
}