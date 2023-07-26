import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SubscriptionDto } from "./dto/subscription.dto";
import { SubscriptionsRepository } from "./subscription.repository";
import { Subscription } from "./subscription.entity";
import { User } from "../user/user.entity";
import { IdsDto } from "./dto/ids.dto";
import { CategoryDto } from "../category/dto/category.dto";
import { SubscriptionTotalDto } from "./dto/subscriptionTotal.dto";
import * as moment from "moment";


@Injectable()
export class SubscriptionsService {
  private logger = new Logger('SubscriptionsRepository', { timestamp:true })

  constructor(private subscriptionsRepo:SubscriptionsRepository) {}

  async getSubscriptionById(id:string, user:User):Promise<Subscription>{
    const found = await this.subscriptionsRepo.findOne({where:{ id, user}})
    if(!found){
      throw  new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  async createSubscription(createTaskDto: SubscriptionDto,user:User): Promise<Subscription> {
    return this.subscriptionsRepo.createSubscription(createTaskDto,user)
  }

  deleteSubscription(ids: IdsDto, user:User): void {
    return ids.ids.forEach(async id=> {
      const result = await this.subscriptionsRepo.delete({ id, user })
      if(result.affected===0){

        throw  new NotFoundException(`Task with ID ${id} not found`);    }
    })

  }


  async updateSubscription(id: string, user:User,updatedSubscription:SubscriptionDto): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id, user);
    updatedSubscription.expirationDate=moment.utc(updatedSubscription.expirationDate).toDate()
    Object.assign(subscription,{...updatedSubscription});
    await this.subscriptionsRepo.save(subscription)
    return subscription;
  }



  getSubscriptions( user : User,from?:string,to?:string):Promise<Subscription[]>{
    return this.subscriptionsRepo.getSubscription(user,from,to);
  }

  async getTotalSubscriptionExpenses(user:User, from?: string,
                                     to?: string):Promise<SubscriptionTotalDto[]>{
    return await this.subscriptionsRepo.getTotalSubscriptionExpenses(user,from,to);
  }

  async getAllTimeExpenses( user:User):Promise<number>{
    return await this.subscriptionsRepo.getAllTimeExpenses(user);
  }

}
