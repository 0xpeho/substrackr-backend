import { Logger, Module } from "@nestjs/common";
import { SubscriptionsModule } from './subscription/subscriptionsModule';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./config.schema";
import { UserModule } from "./user/user.module";
import { CategoryModule } from './category/category.module';
import { NotificationModule } from "./notification/notification.module";
import { Cron, ScheduleModule } from "@nestjs/schedule";
import { NotificationService } from "./notification/notification.service";
import { User } from "./user/user.entity";
import { UsersRepository } from "./auth/users.repository";
import { SubscriptionsService } from "./subscription/subscriptions.service";
import { Subscription } from "./subscription/subscription.entity";
import * as moment from "moment/moment";
import { SubscriptionsRepository } from "./subscription/subscription.repository";
import { DurationInputArg2 } from "moment/moment";
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { SettingsModule } from './settings/settings.module';
import { SettingsEntity } from "./settings/settings.entity";
import { SettingsRepository } from "./settings/settings.repository";
import { NotificationToken } from "./notification/entities/notification-token.entity";
import { Category } from "./category/category.entity";


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configSchema
    }),
    SubscriptionsModule,
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService:ConfigService) => ({
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_host'),
          port: configService.get('DB_port'),
          username: configService.get('DB_username'),
          password: configService.get('DB_password'),
          database: configService.get('DB_database').toString(),
          entities: [User, SettingsEntity,NotificationToken,Category,Subscription],
      })
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    NotificationModule,
    SettingsModule
  ],
  controllers: [SettingsController],
  providers: [UsersRepository,SubscriptionsService,SubscriptionsRepository, SettingsService,SettingsRepository],
})
export class AppModule {
  private readonly logger = new Logger();

  constructor(private notificationService: NotificationService,
              private userRepo: UsersRepository,
              private subscriptionService: SubscriptionsService,
              private settingsService: SettingsService) {
  }

  //@Cron('0 12 * * * ')
  @Cron('* * * * * ')
  async findAllExpiringSubscriptions() {
    let users: User[] = await this.userRepo.find();
    for (const user of users) {
      const settings:SettingsEntity[] = await this.settingsService.getAllUserSettings(user)
      for (const setting of settings) {
          let subs: Subscription[] = await this.subscriptionService.getSubscriptions(user);
          if (subs.length > 0) {
            for (const sub of subs) {
              if (!sub.hasBeenNotified) {
                const itemDate = moment(new Date(sub.expirationDate).toISOString().split('T')[0], moment.ISO_8601)
                if (itemDate.isBetween(moment(), moment().add(setting.informBeforeExpirationDateAmount, setting.informBeforeExpirationDateUnit as DurationInputArg2))) {
                  if (setting.alerts && sub.alerts) {
                    await this.notificationService.sendPush(`${sub.title} is expiring in ${setting.informBeforeExpirationDateAmount} ${setting.informBeforeExpirationDateUnit}`,
                      'Open your App to renew your Subscription or delete it', user, setting.deviceId)
                  }
                  sub.hasBeenNotified = true;
                  await this.subscriptionService.updateSubscription(sub.id, user, sub)
                }
              }
            }
          }
        }
      }

    }

}