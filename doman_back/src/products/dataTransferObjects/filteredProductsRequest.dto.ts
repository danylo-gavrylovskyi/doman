import { IsOptional } from "class-validator";

export class FilteredProductsRequestDto {
	@IsOptional()
	readonly page?: string;

	@IsOptional()
	readonly perPage?: string;

	@IsOptional()
	readonly inputValue?: string;

	@IsOptional()
	readonly categoryId?: string;

	@IsOptional()
	readonly subcategoryId?: string;
}
