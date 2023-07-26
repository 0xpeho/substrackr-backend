import {
  Body,
  Controller, Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { AccessTokenDto } from "./dto/access-token.dto";
import { User } from "../user/user.entity";
import { GetUser } from "./get-user.decorator";
import { NotificationDto } from "../notification/dto/create-notification.dto";

@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post("/signup")
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AccessTokenDto> {
    await this.authService.signUp(authCredentialsDto);
    return this.signIn(authCredentialsDto)
  }

  @Post("/signin")
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AccessTokenDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/guest-login')
  guestLogin(@Body() deviceId:NotificationDto): Promise<AccessTokenDto> {
    return this.authService.guestLogin(deviceId.deviceId);
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verify(@Req() request: Request, @GetUser() user: User): Promise<void> {

  }

  /*
  @Put('reset-email-confirmation')
  @UseInterceptors(ClassSerializerInterceptor)
  resetEmailConfirmation(
    @Body() resetEmailConfirmationDto: ResetEmailConfirmationDto,
  ): Promise<User> {
    return this.userService.resetEmailConfirmation(resetEmailConfirmationDto);
  }

  @Put('reset-password')
  @UseInterceptors(ClassSerializerInterceptor)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<User> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Put('set-new-password')
  @UseInterceptors(ClassSerializerInterceptor)
  setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto): Promise<User> {
    return this.userService.setNewPassword(setNewPasswordDto);
  }
*/
}
