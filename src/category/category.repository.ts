import { Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Subscription } from "../subscription/subscription.entity";
import { User } from "../user/user.entity";
import { Category } from "./category.entity";
import { CategoryDto } from "./dto/category.dto";
import { CategoryTotalDto } from "./dto/CategoryTotal.dto";
import { SubscriptionsRepository } from "../subscription/subscription.repository";

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private logger = new Logger('SubscriptionsRepository', { timestamp: true })

  constructor(private dataSource: DataSource,private subRepo:SubscriptionsRepository) {
    super(Category, dataSource.createEntityManager());
  }

  async getCategories(user: User):Promise<Category[]> {
    return await this.find({where:[{userId:user.id},{userId:'*'}]});
  }

  async createCategories(categoryDto: CategoryDto, user: User) {
    const category = this.create({ ...categoryDto,userId:user.id })

    await this.save(category)

    return category;
  }

  async getTotalsForCategories( user: User,from:string,to:string): Promise<CategoryTotalDto[]> {
    let categories = await this.getCategories(user);
    let totals: CategoryTotalDto[] = [];
    let subs:Subscription[]=await this.subRepo.getSubscription(user, from, to)
    categories.forEach(category=>totals.push({category,total:0,subscriptions:[]}))

    subs.forEach(sub=>{
      totals[totals.findIndex(item=>item.category.id==sub.category.id)].subscriptions.push(sub)
    })

    totals=totals.filter(item=>item.subscriptions.length>0)

    if(totals.length>0) {
      totals.forEach(total => {
        total.subscriptions.forEach(sub=>  total.total += this.subRepo.getTotalForSub(sub,from,to))
      })
    }


    return totals;
  }




}