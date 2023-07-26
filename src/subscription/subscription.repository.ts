import { DataSource, LessThanOrEqual, Repository } from "typeorm";
import { Subscription } from "./subscription.entity";
import { SubscriptionDto } from "./dto/subscription.dto";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "../user/user.entity";
import { CategoryDto } from "../category/dto/category.dto";
import { SubscriptionTotalDto } from "./dto/subscriptionTotal.dto";
import * as moment from "moment";

@Injectable()
export class SubscriptionsRepository extends Repository<Subscription> {
  private logger = new Logger('SubscriptionsRepository', { timestamp:true })
  constructor(private dataSource: DataSource)
  {
    super(Subscription, dataSource.createEntityManager());
  }

  async getSubscription(user : User,from?:string,to?:string):Promise<Subscription[]>{

    try{
      if(from&&to){
        let items= await this.find({
          where: {
            user,
            startDate:  LessThanOrEqual(moment(to,false).toDate())
          },
          order: {
            expirationDate: 'ASC'
          }
      })


        items = items.filter(item=>{
          const itemDate = moment(new Date(item.startDate).toISOString().split('T')[0]);
          return item.cycle===1? true:itemDate.month() >= moment(from).month();
          })
        return items;

      }else{
        return await this.find({
          where: {
            user,
          }
        })
      }
    }catch (error){
      this.logger.error(`Failed to get subscription for user "${user.email}`, error.stack)
      throw new InternalServerErrorException();
    }
  }

  async createSubscription(createSubscriptionDto: SubscriptionDto,user :User): Promise<Subscription> {
    const subscription =this.create({ ...createSubscriptionDto, user });

    await this.save(subscription)

    return subscription;
  }

  async getTotalSubscriptionExpenses(user:User, from:string, to:string):Promise<SubscriptionTotalDto[]> {
    let items;
    let subsTotal:SubscriptionTotalDto[]=[]
    items= await this.getSubscription(user,from,to)

    items.forEach(item=>{
      subsTotal.push({title:item.title,price:this.getTotalForSub(item,from,to)})
    })

    return subsTotal;
  }

  async getAllTimeExpenses(user:User):Promise<number>{
    let items;
    let total:number=0;
    items = await this.find({
      where: {
        user
      },
    });

    items.forEach(item=>{
      if(item.cycle===1) {
        const monthSinceFirstPayment=this.getAbsoluteMonths(moment()) - this.getAbsoluteMonths(moment(new Date(item.startDate).toISOString().split('T')[0], moment.ISO_8601)) + 1
        total+= item.price* monthSinceFirstPayment;
      }else{
        const YearsSinceFirstPayment = moment().year() - moment(new Date(item.startDate).toISOString().split('T')[0]).year()+1;
        total+=item.price * YearsSinceFirstPayment
      }
    })
    return Number(total.toFixed(2))
  }

  getTotalForSub(sub:Subscription, from:string, to:string){
    let total:number=0;
    let startDate=moment(new Date(sub.startDate).toISOString().split('T')[0])
    let toDate=moment(to)
    let fromDate=moment(from)
    let endOfStartYear=startDate.clone().endOf('year')
    const monthSinceFirstPayment=this.getAbsoluteMonths(moment()) - this.getAbsoluteMonths(startDate) + 1;
    const monthSinceBeginningOfYear=this.getAbsoluteMonths(moment()) - this.getAbsoluteMonths(moment().startOf('year')) + 1;
    const monthFromFirstPaymentToEndOfYear=this.getAbsoluteMonths(endOfStartYear) - this.getAbsoluteMonths(startDate) + 1;
    const monthDifference = this.getAbsoluteMonths(toDate.add(1,"day"))-this.getAbsoluteMonths(fromDate);
      if(sub.cycle===1){
        total+=Number(sub.price)*(monthDifference==12?
          (fromDate.year()===startDate.year()?(fromDate.year()===moment().year()?monthSinceFirstPayment:monthFromFirstPaymentToEndOfYear):monthSinceBeginningOfYear)
            :monthDifference)
      }else{
        if(monthDifference==12? true:startDate.month()>= fromDate.month() && startDate.month() <= toDate.month()){
          total+= Number(sub.price)
      }
    }

    return Number(total.toFixed(2));
  }

   getAbsoluteMonths(momentDate) {
    let months = Number(momentDate.format("MM"));
    let years = Number(momentDate.format("YYYY"));
    return months + (years * 12);
  }
}
