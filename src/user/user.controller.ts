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
import { GetSubscriptionFilterDto } from './dto/get-subscription-filter.dto';
import { SubscriptionsService } from "./subscriptions.service";
import { Subscription } from "./subscription.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  private logger = new Logger('SubscriptionController');

  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  getSubscriptions(@Query() filterDto:GetSubscriptionFilterDto, @GetUser() user : User): Promise<Subscription[]>{
    this.logger.verbose(`User "${user.email}" retrieving all subscriptions with filter: ${ JSON.stringify(filterDto) }`)
    return this.subscriptionsService.getSubscriptions(filterDto, user);
  }

  @Get('/:id')
  getSubscriptionById(@Param('id') id: string, @GetUser() user : User): Promise<Subscription> {
    return this.subscriptionsService.getSubscriptionById(id, user);
  }


  @Post()
  createSubscription(@Body() subscriptionDto: SubscriptionDto, @GetUser() user : User): Promise<Subscription> {
    this.logger.verbose(`User "${user.email}" creating a new Subscription with data ${JSON.stringify(subscriptionDto)}`)
    return this.subscriptionsService.createSubscription(subscriptionDto,user);
  }

  @Delete('/:id')
  deleteSubscriptionById(@Param('id') id: string, @GetUser() user:User): Promise<void> {
    return this.subscriptionsService.deleteSubscription(id,user);
  }

  @Put('/:id')
  updateSubscription(
    @Param('id') id: string,
    @Body() subscriptionDto: SubscriptionDto,
    @GetUser() user :User
  ): Promise<Subscription> {
    return this.subscriptionsService.updateSubscription(id,user,subscriptionDto);
  }

}
