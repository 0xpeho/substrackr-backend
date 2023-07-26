import {IsNotEmpty} from 'class-validator'

export class SubscriptionTotalDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

}