import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import * as bcrypt from'bcrypt'

import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {

  constructor(private userRepo:UsersRepository, private jwtService:JwtService) {
  }

  async signUp(authcredentialsdto:AuthCredentialsDto): Promise<void>{
    return this.userRepo.createUser(authcredentialsdto);
  }

  async signIn(authCredentialsDto:AuthCredentialsDto): Promise<{ accessToken:string }>{
    const  { username, password } = authCredentialsDto;

    const user = await this.userRepo.findOne({where:{ username:username}});

    if(user && (await bcrypt.compare(password,user.password))){
      const payload:JwtPayload = {username};
      const accessToken = this.jwtService.sign(payload)
      return  {accessToken}
    }else{
      throw new UnauthorizedException('Please check your Credentials')
    }
  }
}