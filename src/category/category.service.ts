import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../user/user.entity";
import { Category } from "./category.entity";
import { CategoryRepository } from "./category.repository";
import { CategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {

  constructor(private categoryRepo:CategoryRepository) {
  }

  getCategories( user : User):Promise<Category[]>{
    return this.categoryRepo.getCategories(user);
  }

  createCategory(category: CategoryDto, user: User) {
    return this.categoryRepo.createCategories(category,user)
  }

  async deleteCategory(id: string, user: User): Promise<void> {
    const result = await this.categoryRepo.delete({ id, userId:user.id })
    if (result.affected === 0) {
      throw  new NotFoundException(`Task with ID ${id} not found`);
    }
    return;

  }

  getCategoriesTotal(user:User,from:string,to:string){
    return this.categoryRepo.getTotalsForCategories(user,from,to)
  }
}
