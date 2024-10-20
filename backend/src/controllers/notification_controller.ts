import { Request, Response } from 'express';
import { Notification } from "../models/notification/notification.js";
import { NotificationService } from "../services/notification_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  notificationCreate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const notification: Notification = {
      userId: req.body.userId,
      competitionId: req.body.competitionId,
      type: req.body.type,
      message: req.body.message,
      createdAt: req.body.createdAt,
    };

    const result = await this.notificationService.notificationCreate(notification);
    res.json(result);

    return;
  });

  userNotificationsList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const notifications = await this.notificationService.userNotificationsList(Number(userId));
    res.json(notifications);
    return;
  })
}