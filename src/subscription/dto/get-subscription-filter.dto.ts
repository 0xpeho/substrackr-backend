import { IsOptional, IsString} from 'class-validator'

export class GetSubscriptionFilterDto {
    @IsOptional()
    @IsString()
    category:string;

    @IsOptional()
    @IsString()
    search?:string;
}