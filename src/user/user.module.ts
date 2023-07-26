import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from"./user.entity";
import { UsersRepository } from "../auth/users.repository";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationRepository } from "../notification/notification.repository";
import { SettingsService } from "../settings/settings.service";
import { SettingsRepository } from "../settings/settings.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService:ConfigService)=>({
        secret: configService.get('JWT_secret'),
      })
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService,AuthService,UsersRepository,NotificationService,NotificationRepository,SettingsService,SettingsRepository],
  controllers: [UserController],
})
export class UserModule {}
