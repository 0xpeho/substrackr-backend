import { IsEnum, IsOptional} from "class-validator";
import { LanguageEnum } from "../../user/enum/language.enum";
import { ThemeEnum } from "../../user/enum/theme.enum";
import { CurrencyEnum } from "../../user/enum/currency.enum";

export class UpdateUserSettingsDto {
  deviceId:string;
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;

  @IsOptional()
  @IsEnum(ThemeEnum)
  theme?: ThemeEnum;

  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency?: CurrencyEnum;

  @IsOptional()
  alerts?: boolean;

  @IsOptional()
  informBeforeExpirationDateAmount?:number

  @IsOptional()
  informBeforeExpirationDateUnit?:string
}
