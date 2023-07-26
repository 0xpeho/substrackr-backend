import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../user/user.entity";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { SettingsService } from "./settings.service";
import { SettingsEntity } from "./settings.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {

  constructor(private settingsService:SettingsService) {
  }
  @Patch()
  updateUserSettingsForDevice(
    @GetUser() userEntity: User,
    @Body() updateUserDto: UpdateUserSettingsDto
  ): Promise<SettingsEntity> {
    return this.settingsService.updateSettingsForDevice(userEntity, updateUserDto);
  }


  @Get('/:deviceId')
  async getUserSettingsForDevice(@Param('deviceId') deviceId: string,@GetUser() userEntity: User): Promise<SettingsEntity> {
    return this.settingsService.getUserSettingsForDevice(userEntity,deviceId);
  }
}
