import { Body, Controller, Post } from "@nestjs/common";
import { CreateProductAttributeDto } from "./dto/CreateProductAttribute.dto";
import { ProductAttributeService } from "./product-attribute.service";

@Controller("product-attribute")
export class ProductAttributeController {
	constructor(private productAttributeService: ProductAttributeService) { }

	@Post()
	async add(@Body() dto: CreateProductAttributeDto) {
		const productAttribute = await this.productAttributeService.addProductAttribute(dto);
		return productAttribute;
	}
}
