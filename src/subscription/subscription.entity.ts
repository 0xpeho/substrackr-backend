import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { User } from "../auth/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;


  @ManyToOne(type => User,user=> user.subscriptions, {eager:false})
  @Exclude({ toPlainOnly:true })
  user:User
}
