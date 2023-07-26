import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../user/user.entity";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { AuthGuard } from "@nestjs/passport";
import { CategoryDto } from "./dto/category.dto";

@Controller('category')
@UseGuards(AuthGuard('jwt'))

export class CategoryController {

  constructor(private categoryService:CategoryService) {
  }

  @Get()
  getCategories(@GetUser() user : User): Promise<Category[]>{
    return this.categoryService.getCategories(user);
  }

  @Get('categories-totals')
  getCategoriesTotal(@GetUser() user:User,
                     @Query('from') from: string,
                     @Query('to') to: string,){
    return this.categoryService.getCategoriesTotal(user,from,to)
  }

  @Post()
  createCategories(@Body() category:CategoryDto,@GetUser() user : User): Promise<Category>{
    return this.categoryService.createCategory(category,user);
  }

  @Delete()
  async deleteCategoryById(@Body() id: { id }, @GetUser() user: User): Promise<void> {
    return this.categoryService.deleteCategory(id.id, user);
  }
}
