import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../auth/users.repository";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { NotificationDto } from "../notification/dto/create-notification.dto";
import { NotificationService } from "../notification/notification.service";
import { NotificationToken } from "../notification/entities/notification-token.entity";
import { SettingsService } from "../settings/settings.service";


@Injectable()
export class UserService {

  constructor(private usersRepository: UsersRepository, private readonly notificationService: NotificationService,
              private settingsService:SettingsService) {
  }

  async signUpFromGuest(credentials: AuthCredentialsDto, user: User): Promise<void> {
    if (user.password && user.email) {
      throw new UnauthorizedException();
    }
    await this.usersRepository.updateUser(credentials, user.id);
  }

  async deleteUser(user: User): Promise<void> {
    await this.usersRepository.deleteUser(user);
  }

  async findPush(
    user: User,
    deviceId: string
  ): Promise<NotificationToken> {
    return this.notificationService.findPush(user, deviceId);
  };


  async enablePush(
    user: User,
    update_dto: NotificationDto
  ): Promise<any> {
    const settings = await this.settingsService.getUserSettingsForDevice(user, update_dto.deviceId)
    settings.alerts = true;
    await this.usersRepository.save(user);
    return await this.notificationService.enablePushNotifications(
      user,
      update_dto
    );
  };

  async disablePush(
    user: User,
    update_dto: NotificationDto
  ): Promise<void> {
    const settings = await this.settingsService.getUserSettingsForDevice(user, update_dto.deviceId)
    settings.alerts = false;
    await this.usersRepository.save(user);
    await this.notificationService.disablePushNotification(user,update_dto);
  };


  async isUserGuest(user: User) {
    let foundUser = await this.usersRepository.findOne({ where: { id: user.id } })
    return foundUser ? (foundUser.email===null&&foundUser.password===null): false
  }
}
