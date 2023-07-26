import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Subscription } from "../subscription/subscription.entity";
import { Optional } from "@nestjs/common";
import { Exclude } from "class-transformer";
import { SettingsEntity } from "../settings/settings.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  @Optional()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  @Optional()
  password: string;

  @OneToMany(_type => Subscription, subscription => subscription.user, { eager: true }) //get tasks automatically when fetching user
  @Exclude()
  subscriptions: Subscription[];

  @OneToMany(_type => SettingsEntity, setting => setting.user, { eager: true }) //get tasks automatically when fetching user
  @Exclude()
  settings: SettingsEntity[];

}