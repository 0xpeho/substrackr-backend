import { IsNotEmpty } from "class-validator";
import { Category } from "../category.entity";

export class CategoryDto {

  id:string;

  @IsNotEmpty()
  title: string;

}