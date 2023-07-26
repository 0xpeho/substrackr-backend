import { Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationToken } from "./entities/notification-token.entity";

@Injectable()
export class NotificationRepository extends Repository<NotificationToken> {
  private logger = new Logger('', { timestamp: true })

  constructor(private dataSource: DataSource) {
    super(NotificationToken, dataSource.createEntityManager());
  }
}