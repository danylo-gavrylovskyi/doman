import { Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { SubcategoriesController } from "./subcategories.controller";

import { SubcategoriesService } from "./subcategories.service";

import { Subcategory } from "./subcategory.model";
import { Category } from "src/categories/category.model";

import { Product } from "src/products/product.entity";

@Module({
	controllers: [SubcategoriesController],
	providers: [SubcategoriesService, Logger],
	imports: [SequelizeModule.forFeature([Subcategory, Category, Product])],
})
export class SubcategoriesModule { }
