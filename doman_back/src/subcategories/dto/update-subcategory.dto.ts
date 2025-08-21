import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ToNumber } from "src/common/transformers";

export class UpdateSubcategoryDto {
    @ApiPropertyOptional({ example: "ЗМІШУВАЧІ", description: "Subcategory title" })
    @IsString()
    @IsOptional()
    readonly title?: string;

    @ApiPropertyOptional({ example: 1, description: "Category id to which this subcategory belongs to" })
    @ToNumber()
    @IsNumber()
    @IsOptional()
    readonly categoryId?: number;

    @ApiPropertyOptional({
        example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
        description: "Subcategory image",
    })
    @IsString()
    @IsOptional()
    readonly image?: string;
}
