import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
	@ApiPropertyOptional({ example: "Змішувачі", description: "Category title" })
	@IsString()
	@IsOptional()
	readonly title?: string;

	@ApiPropertyOptional({
		example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
		description: "Category image",
	})
	@IsString()
	@IsOptional()
	readonly image?: string;
}
