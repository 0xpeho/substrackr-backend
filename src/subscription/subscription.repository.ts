import { DataSource, Repository } from "typeorm";
import { Subscription } from "./subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";

import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetSubscriptionFilterDto } from "./dto/get-subscription-filter.dto";
import { User } from "../auth/user.entity";
import { filter } from "rxjs";

@Injectable()
export class SubscriptionsRepository extends Repository<Subscription> {
  private logger = new Logger('SubscriptionsRepository', { timestamp:true })
  constructor(private dataSource: DataSource)
  {
    super(Subscription, dataSource.createEntityManager());
  }

  async getSubscription(filterdto:GetSubscriptionFilterDto, user : User):Promise<Subscription[]>{

    const { categorie, search } =filterdto;
    const query= this.createQueryBuilder('Subscription');
    query.where({user})

    if(categorie){
      query.andWhere('subscription.categorie = :categorie', {categorie: categorie})
    }

    if(search){
      query.andWhere('(LOWER(subscription.title) LIKE LOWER(:subscription) OR LOWER(subscription.description) LIKE LOWER(:subscription))', { search: `%${filterdto.search}%`});
    }
    try {
      return await query.getMany();
    }catch (error){
      this.logger.error(`Failed to get categorie for user "${user.username} with filters ${JSON.stringify(filterdto)}`, error.stack)
      throw new InternalServerErrorException();
    }
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto, user :User): Promise<Subscription> {
    const { title, description } = createSubscriptionDto;

    const subscription = this.create({ title, description, user })

    await this.save(subscription)

    return subscription;
  }
}
