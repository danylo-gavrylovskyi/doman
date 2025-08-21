import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { ToNumber } from "src/common/transformers";

export class CreateSubcategoryDto {
	@ApiProperty({ example: "ЗМІШУВАЧІ", description: "Subcategory title" })
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@ApiProperty({ example: "zmishyvachi", description: "Subcategory slug" })
	@IsString()
	@IsNotEmpty()
	readonly slug: string;

	@ApiProperty({ example: 1, description: "To which category this subcategory belongs to" })
	@ToNumber()
	@IsNumber()
	readonly categoryId: number;

	@ApiPropertyOptional({
		example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
		description: "Subcategory image",
	})
	@IsString()
	@IsOptional()
	readonly image?: string;
}
