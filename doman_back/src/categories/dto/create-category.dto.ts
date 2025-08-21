import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
	@ApiProperty({ example: "Змішувачі", description: "Category title" })
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@ApiProperty({ example: "zmishyvachi", description: "Category slug" })
	@IsString()
	@IsNotEmpty()
	readonly slug: string;

	@ApiProperty({
		example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
		description: "Category image",
	})
	@IsString()
	@IsNotEmpty()
	readonly image: string;
}
