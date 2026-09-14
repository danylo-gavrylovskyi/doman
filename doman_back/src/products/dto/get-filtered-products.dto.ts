import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

import { ToBoolean, ToNumber } from "src/common/transformers";

export class GetFilteredProductsDto {
	@ApiPropertyOptional({ example: 1, description: "Page number" })
	@ToNumber()
	@IsOptional()
	@IsNumber()
	readonly page?: number;

	@ApiPropertyOptional({ example: 10, description: "Products per page" })
	@ToNumber()
	@IsOptional()
	@IsNumber()
	readonly perPage?: number;

	@ApiPropertyOptional({ example: "змішувач", description: "Value to search by name" })
	@IsOptional()
	@IsString()
	readonly inputValue?: string;

	@ApiPropertyOptional({ example: 1, description: "Product from which category to fetch" })
	@ToNumber()
	@IsOptional()
	@IsNumber()
	readonly categoryId?: number;

	@ApiPropertyOptional({ example: 1, description: "Product from which subcategory to fetch" })
	@ToNumber()
	@IsOptional()
	@IsNumber()
	readonly subcategoryId?: number;

	@ApiPropertyOptional({ example: true, description: "Fetch only products marked as popular" })
	@ToBoolean()
	@IsOptional()
	@IsBoolean()
	readonly isPopular?: boolean;
}
