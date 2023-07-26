import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { UsersRepository } from "./users.repository";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SettingsService } from "../settings/settings.service";
import { SettingsRepository } from "../settings/settings.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService:ConfigService)=>({
        secret: configService.get('JWT_secret'),

      })
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService,UsersRepository,JwtStrategy,SettingsService,SettingsRepository],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
