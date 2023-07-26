import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsRepository } from './subscription.repository';
import { Subscription } from "./subscription.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionsService,SubscriptionsRepository],
})
export class SubscriptionsModule {}
