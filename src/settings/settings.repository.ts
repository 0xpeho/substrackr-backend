import { Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SettingsEntity } from "./settings.entity";

@Injectable()
export class SettingsRepository extends Repository<SettingsEntity> {

  private logger = new Logger('SettingsRepository', { timestamp: true })

  constructor(private dataSource: DataSource,
              //private mailService:MailService
  ) {
    super(SettingsEntity, dataSource.createEntityManager());
  }
}