import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { LanguageEnum } from "../enum/language.enum";
import { ThemeEnum } from "../enum/theme.enum";
import { CurrencyEnum } from "../enum/currency.enum";
import { Column } from "typeorm";

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
