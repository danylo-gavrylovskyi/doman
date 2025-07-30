import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ProductsController } from "./products.controller";

import { ProductsService } from "./products.service";
import { ProductAttributeService } from "src/product-attribute/product-attribute.service";

import { Product } from "./product.entity";
import { Subcategory } from "src/subcategories/subcategory.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";
import { Attribute } from "src/attributes/attribute.model";

@Module({
	controllers: [ProductsController],
	providers: [ProductsService, ProductAttributeService],
	imports: [SequelizeModule.forFeature([Product, Subcategory, ProductAttribute])],
})
export class ProductsModule { }
