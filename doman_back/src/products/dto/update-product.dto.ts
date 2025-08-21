import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

import { ToBoolean, ToJsonArray, ToNumber } from "src/common/transformers";

import { AttributeIdValuePair } from "src/products/types/attribute-value-pair.type";

export class UpdateProductDto {
    @ApiPropertyOptional({ example: "12343afdf232", description: "Product article" })
    @IsOptional()
    @IsString()
    readonly article?: string;

    @ApiPropertyOptional({ example: "КОТЕЛ ТВЕРДОПАЛИВНИЙ EDELMET 33 КВТ", description: "Product name" })
    @IsOptional()
    @IsString()
    readonly title?: string;

    @ApiPropertyOptional({
        example: "Радіатори виготовлені з холоднокатної сталі товщиною 1,5 мм",
        description: "Product description",
    })
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiPropertyOptional({ example: 264, description: "Product quantity" })
    @ToNumber()
    @IsOptional()
    @IsNumber()
    readonly quantity?: number;

    @ApiPropertyOptional({ example: 1289, description: "Product price" })
    @ToNumber()
    @IsOptional()
    @IsNumber()
    readonly price?: number;

    @ApiPropertyOptional({ example: true, description: "Is this product popular" })
    @ToBoolean()
    @IsOptional()
    @IsBoolean()
    readonly isPopular?: boolean;

    @ApiPropertyOptional({ example: 1, description: "To which subcategory this product belongs to" })
    @ToNumber()
    @IsOptional()
    @IsNumber()
    readonly subcategoryId?: number;

    @ApiPropertyOptional({
        example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
        description: "Product image",
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({
        example: '[{"attributeId":1,"value":"red"}]',
        description: "Product old attribute values as JSON string",
    })
    @ToJsonArray<AttributeIdValuePair>()
    @IsOptional()
    readonly oldAttributeValues?: AttributeIdValuePair[];

    @ApiPropertyOptional({
        example: '[{"attributeId":1,"value":"yellow"}]',
        description: "Product new attribute values as JSON string",
    })
    @ToJsonArray<AttributeIdValuePair>()
    @IsOptional()
    readonly newAttributeValues?: AttributeIdValuePair[];
}
