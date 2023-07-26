import { IsNotEmpty } from "class-validator";
import { Category } from "../category.entity";
import { SubscriptionDto } from "../../subscription/dto/subscription.dto";
import { CategoryDto } from "./category.dto";
import { Subscription } from "../../subscription/subscription.entity";

export class CategoryTotalDto {

  @IsNotEmpty()
  category:CategoryDto;

  @IsNotEmpty()
  total:number

  subscriptions:Subscription[]

}