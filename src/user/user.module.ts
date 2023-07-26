import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { UsersRepository } from "../auth/users.repository";


@Module({
  imports: [
    TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService,UsersRepository],
})
export class UserModule {}
