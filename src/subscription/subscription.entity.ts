import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Exclude } from "class-transformer";
import { Optional } from "@nestjs/common";
import { Category } from "../category/category.entity";
@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({nullable:true})
  @Optional()
  description: string;

  @Column({nullable:true})
  @Optional()
  paymentType: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: 'date' })
  startDate : Date;

  @CreateDateColumn({ type: 'date' })
  expirationDate : Date;

  @Column({default:1})
  cycle: number;


  @Column({default:false})
  alerts:boolean;

  @Column({default:false})
  hasBeenNotified:boolean;

  @ManyToOne(_type => User,user=> user.subscriptions, {cascade:true,onDelete:'CASCADE'})
  @Exclude({ toPlainOnly:true })
  user:User

  @ManyToOne(_type => Category,category=> category.subscriptions,{eager:true})
  @Optional()
  category:Category
}
