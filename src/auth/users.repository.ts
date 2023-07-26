import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersRepository extends Repository<User> {

  private logger = new Logger('UsersRepository', { timestamp:true })
  constructor(private dataSource: DataSource,
              //private mailService:MailService
              ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(credentials: AuthCredentialsDto): Promise<void> {
    const userWithEmail = await this.findOne({where:{email:credentials.email}});

    if (userWithEmail) {
      this.logger.warn(`Email already exists ${credentials.email}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: ['email already exists'],
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    const user = this.create({ email: credentials.email, password: await this.createHash(credentials) });

    await this.save(user)
    this.logger.log(`Successfully registered new user with id '${user.id}'`);

    //this.prepareSendingDoubleOptInEmail(user);


  }

  async updateUser(credentials: AuthCredentialsDto, userId: string): Promise<void> {
    if (credentials) {
      const user = await this.findOne({ where: { id: userId } });
      if (credentials.email) {
        user.email = credentials.email;
      }
      if (credentials.password) {
        user.password = await this.createHash(credentials);
      }
      try {
        this.save(user);
      } catch (error) {
        if (error.code == 23505) {
          throw new ConflictException("Username already exits");
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new ConflictException("Credentials must be provided");
    }

  }

  async createGuest(): Promise<User> {

    try {
      const user = await this.save(this.create());
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async createHash(credentials: AuthCredentialsDto): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(credentials.password, salt);
  }

  async deleteUser(user:User):Promise<void>{
    await this.remove(user);
  }

  /*
  private async prepareSendingSetNewPasswordEmail(user: User): Promise<void> {
    const randomToken = this.createRandomToken(32);

    const success = await this.mailService.sendSetNewPasswordMail(
      user.email.toLowerCase(),
      randomToken,
    );

    if (success) {
      user.resetPasswordToken = randomToken;
      user.resetPasswordSentAt = new Date();
      user.resetPasswordInProgress = true;

      await this.save(user);
    }
  }

  private async prepareSendingDoubleOptInEmail(user: User): Promise<void> {
    const randomToken = this.createRandomToken(32);

    const success = await this.mailService.sendDoubleOptInMail(
      user.email.toLowerCase(),
      randomToken,
    );

    if (success) {
      user.doubleOptInToken = randomToken;
      user.doubleOptInSentAt = new Date();
      user.doubleOptInConfirmedAt = null;

      await this.save(user);
    }
  }

  createRandomToken(size: number): string {
    return crypto.randomBytes(size).toString('hex');
  }

   */
}