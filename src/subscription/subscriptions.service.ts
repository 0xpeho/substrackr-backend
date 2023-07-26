import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { SubscriptionsRepository } from "./subscription.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "./subscription.entity";
import { GetSubscriptionFilterDto } from "./dto/get-subscription-filter.dto";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";
import { SubscriptionController } from "./subscription.controller";


@Injectable()
export class SubscriptionsService {

  constructor(private subscriptionsRepo:SubscriptionsRepository) {}

  async getTaskById(id:string, user:User):Promise<Subscription>{
    const found = await this.subscriptionsRepo.findOne({where:{ id, user}})
    if(!found){
      throw  new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  async createSubscription(createTaskDto: CreateSubscriptionDto, user:User): Promise<Subscription> {
    return this.subscriptionsRepo.createSubscription(createTaskDto,user)
  }

  async deleteSubscription(id: string, user:User): Promise<void> {
    const result = await this.subscriptionsRepo.delete({id,user})
    if(result.affected===0){
      throw  new NotFoundException(`Task with ID ${id} not found`);    }
  }

  /*
  async updateTaskSatus(id: string, status: TaskStatus, user:User): Promise<Subscription> {
    const task = await this.getTaskById(id, user);

    await this.subscriptionsRepo.save(task)
    return task;
  }

   */

  getTasks(filterdto:GetSubscriptionFilterDto, user : User):Promise<Subscription[]>{
    return this.subscriptionsRepo.getSubscription(filterdto, user);
  }

}
