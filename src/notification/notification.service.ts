import { Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
import * as path from "path";
import { NotificationToken } from "./entities/notification-token.entity";
import { NotificationDto } from "./dto/create-notification.dto";
import { User } from "../user/user.entity";
import { NotificationRepository } from "./notification.repository";

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-admin-sdk.json'),
  ),
});
@Injectable()
export class NotificationService {
  constructor(
    private notificationTokenRepo: NotificationRepository,
  ) {}

  async enablePushNotifications (
    user: User,
    notification_dto: NotificationDto,
  ): Promise<NotificationToken> {
    const push=await this.findPush(user,notification_dto.deviceId)
    if(push){
      push.status='ACTIVE'
      return await this.notificationTokenRepo.save(push)
    }
    if(notification_dto.notification_token){

    return await this.notificationTokenRepo.save({
      user: user,
      notification_token: notification_dto.notification_token,
      deviceId:notification_dto.deviceId,
      status: 'ACTIVE',
    });
    }

  };

  disablePushNotification = async (
    user: User,
    update_dto:NotificationDto
  ): Promise<void> => {
    try {
      await this.notificationTokenRepo.update(
        { user: { id: user.id },deviceId:update_dto.deviceId},
        {
          status: 'INACTIVE',
        },
      );
    } catch (error) {
      return error;
    }
  };


  async sendPush  ( title: string, body: string, user:User, deviceId:string): Promise<void>  {
    try {
      const notifications = await this.notificationTokenRepo.find({
        where: { user: { id: user.id }, status: 'ACTIVE',deviceId },
      });
      if (notifications) {
        for (const notification of notifications) {
        await firebase
          .messaging()
          .send({
            notification: { title, body },
            token: notification.notification_token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
        }
      }
    } catch (error) {
      return error;
    }
  };


  findPush(user: User, deviceId: string) {
    return this.notificationTokenRepo.findOne({where:{user,deviceId}})

  }
}
