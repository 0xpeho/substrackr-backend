import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "../subscription/subscription.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(_type => Subscription, subscription => subscription.category)
  subscriptions: Subscription[];

  @Column()
  userId:string
}