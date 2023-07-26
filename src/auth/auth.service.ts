import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import * as bcrypt from'bcrypt'

import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { AccessTokenDto } from "./dto/access-token.dto";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class AuthService {

  constructor(private userRepo:UsersRepository, private jwtService:JwtService,private settingsService:SettingsService) {
  }

  async signUp(authCredentialsDto:AuthCredentialsDto): Promise<void>{
    return this.userRepo.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto:AuthCredentialsDto): Promise<AccessTokenDto>{
    const  { email, password } = authCredentialsDto;

    const user = await this.userRepo.findOne({where:{email}});

    if(user && (await bcrypt.compare(password,user.password))){
      if(!await this.settingsService.getUserSettingsForDevice(user, authCredentialsDto.deviceId)){
        await this.settingsService.generateUserSettingsForDevice(user, authCredentialsDto.deviceId)
      }
      return this.createAccessToken(user.id);

    }else{
      throw new UnauthorizedException('Please check your Credentials')
    }
  }

  async guestLogin(deviceId:string): Promise<AccessTokenDto>{
    const user=await this.userRepo.createGuest();
    if(!await this.settingsService.getUserSettingsForDevice(user, deviceId)){
      await this.settingsService.generateUserSettingsForDevice(user, deviceId)
    }
    return this.createAccessToken(user.id);
  }

  createAccessToken(userId:string):AccessTokenDto{
    const payload:JwtPayload = {userId};
    const accessToken = this.jwtService.sign(payload)
    return  {accessToken}
  }
}
