import {IsNotEmpty} from 'class-validator'
import { CycleEnum } from "../enum/cycle.enum";
export class CreateSubscriptionDto {
    @IsNotEmpty()
    title: string;

    description: string;

    paymentType: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    expirationDate : Date;

    @IsNotEmpty()
    cycle: CycleEnum;

    category:string;

    @IsNotEmpty()
    alerts:boolean;
}