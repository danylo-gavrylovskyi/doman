import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";

import { ProductAttribute } from "./product-attribute.model";

import { CreateProductAttributeDto } from "./dto/CreateProductAttribute.dto";

@Injectable()
export class ProductAttributeService {
	constructor(
		@InjectModel(ProductAttribute) private productAttributeRepo: typeof ProductAttribute
	) { }

	addProductAttribute(dto: CreateProductAttributeDto, transaction?: Transaction): Promise<ProductAttribute> {
		return this.productAttributeRepo.create(dto, { transaction });
	}

	updateProductAttribute(productId: number, attributeId: number, attributeValue: string, transaction?: Transaction): Promise<[number]> {
		return this.productAttributeRepo.update(
			{ attributeValue },
			{ where: { productId, attributeId }, transaction },
		);
	}
}
