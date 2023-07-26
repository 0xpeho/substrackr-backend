import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  Post, Put,
  Query, UseGuards
} from "@nestjs/common";
import { SubscriptionDto } from './dto/subscription.dto';
import { SubscriptionsService } from "./subscriptions.service";
import { Subscription } from "./subscription.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../user/user.entity";
import { GetUser } from "../auth/get-user.decorator";
import { IdsDto } from "./dto/ids.dto";
import { CategoryDto } from "../category/dto/category.dto";
import { SubscriptionTotalDto } from "./dto/subscriptionTotal.dto";


@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  private logger = new Logger('SubscriptionController');

  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  getSubscriptions(@GetUser() user : User): Promise<Subscription[]>{
    return this.subscriptionsService.getSubscriptions(user);
  }

  @Get('/timeframe')
  getSubscriptionsTimeframe(@Query('from') from: string,
                   @Query('to') to: string, @GetUser() user : User): Promise<Subscription[]>{
    return this.subscriptionsService.getSubscriptions(user,from,to);
  }

  @Get('/get/:id')
  getSubscriptionById(@Param('id') id: string, @GetUser() user : User): Promise<Subscription> {
    return this.subscriptionsService.getSubscriptionById(id, user);
  }

  @Get('/subscription-expenses')
  getTotalSubscriptionExpenses(@Query('from') from: string,
                                @Query('to') to: string, @GetUser() user : User): Promise<SubscriptionTotalDto[]> {
    return this.subscriptionsService.getTotalSubscriptionExpenses(user,from,to);
  }

  @Get('/all-time-expenses')
  getAllTimeExpenses(@GetUser() user : User): Promise<number> {
    return this.subscriptionsService.getAllTimeExpenses(user);
  }


  @Post()
  createSubscription(@Body() subscription: SubscriptionDto, @GetUser() user : User): Promise<Subscription> {
    return this.subscriptionsService.createSubscription(subscription,user);
  }

  @Delete()
  deleteSubscriptionById(@Body() ids:IdsDto, @GetUser() user:User): void {
    return this.subscriptionsService.deleteSubscription(ids,user);
  }

  @Put()
  updateSubscription(
    @Body() subscription: SubscriptionDto,
    @GetUser() user :User
  ): Promise<Subscription> {
    return this.subscriptionsService.updateSubscription(subscription.id,user,subscription);
  }

}
