import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "../subscription/subscription.entity";
import { Optional } from "@nestjs/common";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({unique:true,nullable:true})
  @Optional()
  email:string;

  @Column({nullable:true})
  @Optional()
  password:string;

  @OneToMany(_type => Subscription,subscription=>subscription.user,{eager:true}) //get tasks automatically when fetching user
  subscriptions:Subscription[];
}