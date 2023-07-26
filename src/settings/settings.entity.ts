import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CurrencyEnum } from "../user/enum/currency.enum";
import { LanguageEnum } from "../user/enum/language.enum";
import { ThemeEnum } from "../user/enum/theme.enum";
import { User } from "../user/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class SettingsEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default:CurrencyEnum.EURO})
  currency: CurrencyEnum;

  @Column({default:LanguageEnum.ENGLISH})
  language: LanguageEnum;

  @Column({default:ThemeEnum.AUTO})
  theme: ThemeEnum;

  @Column({default:false})
  alerts: boolean;

  @Column({default:1})
  informBeforeExpirationDateAmount:number

  @Column({default:'w'})
  informBeforeExpirationDateUnit:string

  @Column()
  deviceId: string;

  @ManyToOne(_type => User,user=> user.settings, {cascade:true,onDelete:'CASCADE'})
  @Exclude({ toPlainOnly:true })
  user:User

}