import { Body, Controller, Post } from "@nestjs/common";
import { CreateProductAttributeDto } from "./dto/create-product-attribute.dto";
import { ProductAttributeService } from "./product-attribute.service";
import { Auth } from "src/auth/decorators/auth.decorator";

@Controller("product-attribute")
export class ProductAttributeController {
	constructor(private productAttributeService: ProductAttributeService) { }

	@Auth("admin")
	@Post()
	async add(@Body() dto: CreateProductAttributeDto) {
		const productAttribute = await this.productAttributeService.addProductAttribute(dto);
		return productAttribute;
	}
}
