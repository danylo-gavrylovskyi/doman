import { Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ImagesModule } from "src/images/images.module";

import { ProductsController } from "./products.controller";

import { ProductsService } from "./products.service";
import { ProductAttributeService } from "src/product-attribute/product-attribute.service";

import { Product } from "./product.model";
import { Subcategory } from "src/subcategories/subcategory.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";

@Module({
	controllers: [ProductsController],
	providers: [ProductsService, ProductAttributeService, Logger],
	imports: [
		SequelizeModule.forFeature([Product, Subcategory, ProductAttribute]),
		ImagesModule
	],
})
export class ProductsModule { }
