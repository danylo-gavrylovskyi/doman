import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ToNumber } from "src/common/transformers";

export class CreateProductAttributeDto {
	@ApiProperty({ example: 1, description: "Product id" })
	@ToNumber()
	@IsNumber()
	productId: number;

	@ApiProperty({ example: 1, description: "Attribute id" })
	@ToNumber()
	@IsNumber()
	attributeId: number;

	@ApiProperty({ example: "Red", description: "Value of product's attribute" })
	@IsString()
	@IsNotEmpty()
	attributeValue: string;
}
