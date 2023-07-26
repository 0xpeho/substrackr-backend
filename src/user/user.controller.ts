import {
  Body,
  Controller, Delete, Get,
  Logger, Param, Post, Put,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { NotificationDto } from "../notification/dto/create-notification.dto";


@Controller("user")
@UseGuards(AuthGuard("jwt"))
export class UserController {
  private logger = new Logger("UserController");

  constructor(private userService: UserService) {
  }

  @Post("/signup-from-guest")
  signUpFromGuest(@GetUser() user: User, @Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log('user');
    return this.userService.signUpFromGuest(authCredentialsDto, user);
  }

  @Delete()
  deleteUser(@GetUser() user: User): Promise<void> {
    return this.userService.deleteUser(user);
  }

  @Get()
  isUserGuest(@GetUser() user:User):Promise<boolean>{
    return this.userService.isUserGuest(user)
  }

  @Get("/push/:deviceId")
  async getExistingPush(
    @Param('deviceId') deviceId: string,
    @GetUser() user: User
  ) {
    return await this.userService.findPush(user, deviceId);
  }

  @Put("/push/enable")
  async enablePush(
    @Body() update_dto: NotificationDto,
    @GetUser() user: User
  ) {
    return await this.userService.enablePush(user, update_dto);
  }

  @Put("/push/disable")
  async disablePush(
    @GetUser() user: User,
    @Body() update_dto: NotificationDto,
  ) {
    return await this.userService.disablePush(user,update_dto);
  }

  @Get()
  async getUserById(@GetUser() userEntity: User): Promise<User> {
    return userEntity;
  }
}
