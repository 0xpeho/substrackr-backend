import { Module } from '@nestjs/common';
import { SubscriptionsModule } from './subscription/subscriptionsModule';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./config.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configSchema
    }),
    SubscriptionsModule,
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService:ConfigService) => ({
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_host'),
          port: configService.get('DB_port'),
          username: configService.get('DB_username'),
          password: configService.get('DB_password'),
          database: configService.get('DB_database').toString()
      })
    }),
    AuthModule
  ],
})
export class AppModule {}
