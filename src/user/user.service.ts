import { Injectable, NotFoundException } from "@nestjs/common";
import { SubscriptionDto } from "./dto/subscription.dto";
import { SubscriptionsRepository } from "./subscription.repository";
import { Subscription } from "./subscription.entity";
import { GetSubscriptionFilterDto } from "./dto/get-subscription-filter.dto";
import { User } from "../auth/user.entity";


@Injectable()
export class SubscriptionsService {

  constructor(private subscriptionsRepo:SubscriptionsRepository) {}

  async getSubscriptionById(id:string, user:User):Promise<Subscription>{
    const found = await this.subscriptionsRepo.findOne({where:{ id, user}})
    if(!found){
      throw  new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  async createSubscription(createTaskDto: SubscriptionDto, user:User): Promise<Subscription> {
    return this.subscriptionsRepo.createSubscription(createTaskDto,user)
  }

  async deleteSubscription(id: string, user:User): Promise<void> {
    const result = await this.subscriptionsRepo.delete({id,user})
    if(result.affected===0){
      throw  new NotFoundException(`Task with ID ${id} not found`);    }
  }


  async updateSubscription(id: string, user:User,updatedSubscription:SubscriptionDto): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id, user);
    Object.assign(subscription,{...updatedSubscription});
    await this.subscriptionsRepo.save(subscription)
    return subscription;
  }



  getSubscriptions(filterDto:GetSubscriptionFilterDto, user : User):Promise<Subscription[]>{
    return this.subscriptionsRepo.getSubscription(filterDto, user);
  }

}
