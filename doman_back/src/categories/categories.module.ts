import { Logger, Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { SequelizeModule } from "@nestjs/sequelize";

import { Category } from "./category.model";
import { Subcategory } from "src/subcategories/subcategory.model";
import { Product } from "src/products/product.entity";

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, Logger],
	imports: [SequelizeModule.forFeature([Category, Subcategory, Product])],
})
export class CategoriesModule { }
