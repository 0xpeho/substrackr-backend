import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  Patch,
  Post,
  Query, UseGuards
} from "@nestjs/common";
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
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
  getSubscriptions(@Query() filterdto:GetSubscriptionFilterDto, @GetUser() user : User): Promise<Subscription[]>{
    this.logger.verbose(`User "${user.username}" retrieving all subscriptions with filter: ${ JSON.stringify(filterdto) }`)
    return this.subscriptionsService.getTasks(filterdto, user);
  }

  @Get('/:id')
  getSubscriptionById(@Param('id') id: string, @GetUser() user : User): Promise<Subscription> {
    return this.subscriptionsService.getTaskById(id, user);
  }


  @Post()
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @GetUser() user : User): Promise<Subscription> {
    this.logger.verbose(`User "${user.username}" creating a new Subscription with data ${JSON.stringify(createSubscriptionDto)}`)
    return this.subscriptionsService.createSubscription(createSubscriptionDto,user);
  }

  @Delete('/:id')
  deleteSubscriptionById(@Param('id') id: string, @GetUser() user:User): Promise<void> {
    return this.subscriptionsService.deleteSubscription(id,user);
  }
  /*

  @Patch('/:id/status')
  updateSubscriptionStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusdto: UpdateTaskStatusDto,
    @GetUser() user :User
  ): Promise<Subscription> {
    const { status } = updateTaskStatusdto;
    return this.subscriptionsService.updateTaskSatus(id, status, user);
  }

   */
}
