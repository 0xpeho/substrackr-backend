import { Injectable, Logger } from "@nestjs/common";
import { User } from "../user/user.entity";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { LanguageEnum } from "../user/enum/language.enum";
import { CurrencyEnum } from "../user/enum/currency.enum";
import { ThemeEnum } from "../user/enum/theme.enum";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";

@Injectable()
export class SettingsService {
  private logger = new Logger('SubscriptionsService', { timestamp:true })

  constructor(private settingsRepo:SettingsRepository) {
  }

  async updateSettingsForDevice(userEntity: User, updateUserSettingsDto: UpdateUserSettingsDto): Promise<SettingsEntity> {
    let settings = await this.getUserSettingsForDevice(userEntity,updateUserSettingsDto.deviceId)
    if (Object.keys(settings).length === 0) {
      return settings;
    }

    if (updateUserSettingsDto.language) {
      if ((Object.values(LanguageEnum) as string[]).includes(updateUserSettingsDto.language)) {
        settings.language = updateUserSettingsDto.language;
      } else {
        settings.language = LanguageEnum.ENGLISH;
      }
    }

    if (updateUserSettingsDto.alerts) {
      settings.alerts = updateUserSettingsDto.alerts;
    }

    if (updateUserSettingsDto.currency) {
      if ((Object.values(CurrencyEnum) as string[]).includes(updateUserSettingsDto.currency)) {
        settings.currency = updateUserSettingsDto.currency;
      } else {
        settings.currency = CurrencyEnum.EURO;
      }
    }

    if (updateUserSettingsDto.theme) {
      if ((Object.values(ThemeEnum) as string[]).includes(updateUserSettingsDto.theme)) {
        settings.theme = updateUserSettingsDto.theme;
      } else {
        settings.theme = ThemeEnum.AUTO;
      }
    }

    if (updateUserSettingsDto.informBeforeExpirationDateAmount) {
      settings.informBeforeExpirationDateAmount = updateUserSettingsDto.informBeforeExpirationDateAmount;
    }

    if (updateUserSettingsDto.informBeforeExpirationDateUnit) {
      //TODO:check if string is of type DurationInputArg2
      settings.informBeforeExpirationDateAmount = updateUserSettingsDto.informBeforeExpirationDateAmount;
    }


    return await this.settingsRepo.save(settings);
  }


  async getUserSettingsForDevice(user: User, deviceId: string): Promise<SettingsEntity> {

    return await this.settingsRepo.findOne({ where: { user, deviceId } });
  }

  async getAllUserSettings(user:User):Promise<SettingsEntity[]>{
    return await this.settingsRepo.find({where:{user}})
  }

  async generateUserSettingsForDevice(user:User,deviceId:string){
    await this.settingsRepo.save(this.settingsRepo.create({ user, deviceId }))
  }
}
