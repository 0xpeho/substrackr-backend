import {IsEnum, IsOptional, IsString} from 'class-validator'

export class GetSubscriptionFilterDto {
    @IsOptional()
    @IsString()
    categorie:string;

    @IsOptional()
    @IsString()
    search?:string;
}