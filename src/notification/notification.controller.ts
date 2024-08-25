import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity/notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationService.getAllNotifications();
  }
}
