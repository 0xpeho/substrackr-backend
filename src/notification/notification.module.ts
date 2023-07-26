import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationToken } from './entities/notification-token.entity';
import { NotificationRepository } from "./notification.repository";
import { UsersRepository } from "../auth/users.repository";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationToken])],
  controllers: [],
  providers: [NotificationService,NotificationRepository,UsersRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
