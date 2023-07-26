import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "./users.repository";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private userRepo:UsersRepository, private configService:ConfigService ) {
    super({
      secretOrKey: configService.get('JWT_secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload:JwtPayload):Promise<User> {
    const { username } = payload;
    const user = await this.userRepo.findOne({where:{username:username}});

    if(!user){
      throw new UnauthorizedException();
    }

    return user;
  }
}