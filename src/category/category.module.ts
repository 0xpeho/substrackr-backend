import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { SubscriptionsRepository } from "../subscription/subscription.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepository,SubscriptionsRepository],
})
export class CategoryModule {}
