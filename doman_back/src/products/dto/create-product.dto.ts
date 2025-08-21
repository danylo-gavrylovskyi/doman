import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { ToJsonArray, ToNumber } from "src/common/transformers";

import { AttributeIdValuePair } from "src/products/types/attribute-value-pair.type";

export class CreateProductDto {
	@ApiProperty({ example: "12343afdf232", description: "Product article" })
	@IsString()
	@IsNotEmpty()
	readonly article: string;

	@ApiProperty({ example: "smesitel-dlya-kuhni", description: "Product slug" })
	@IsString()
	@IsNotEmpty()
	readonly slug: string;

	@ApiProperty({
		example: "Радіатори виготовлені з холоднокатної сталі товщиною 1,5 мм",
		description: "Product description",
	})
	@IsString()
	readonly description: string;

	@ApiProperty({ example: "КОТЕЛ ТВЕРДОПАЛИВНИЙ EDELMET 33 КВТ", description: "Product name" })
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@ApiProperty({ example: 264, description: "Product quantity" })
	@ToNumber()
	@IsNumber()
	readonly quantity: number;

	@ApiProperty({ example: 1289, description: "Product price" })
	@ToNumber()
	@IsNumber()
	readonly price: number;

	@ApiProperty({ example: 1, description: "To which subcategory this product belongs to" })
	@ToNumber()
	@IsNumber()
	readonly subcategoryId: number;

	@ApiProperty({
		example: '[{"attributeId":1,"value":"red"}]',
		description: "Product attribute values as JSON string",
	})
	@ToJsonArray<AttributeIdValuePair>()
	@IsNotEmpty()
	readonly attributeValues: AttributeIdValuePair[];

	@ApiPropertyOptional({
		example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
		description: "Product image",
	})
	@IsString()
	@IsOptional()
	readonly image?: string;
}
