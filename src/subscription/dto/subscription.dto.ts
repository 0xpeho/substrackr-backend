import { IsNotEmpty, IsOptional } from "class-validator";
import { CategoryDto } from "../../category/dto/category.dto";

export class SubscriptionDto {

    @IsOptional()
    id?:string;

    @IsNotEmpty()
    title: string;

    description: string;

    paymentType: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    expirationDate : Date;

    @IsNotEmpty()
    startDate : Date;

    @IsNotEmpty()
    cycle: number;

    alerts:boolean;

    category:CategoryDto;
}