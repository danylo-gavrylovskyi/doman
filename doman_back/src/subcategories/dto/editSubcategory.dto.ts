import { ApiProperty } from "@nestjs/swagger";

export class EditSubcategoryDto {
    @ApiProperty({ example: "ЗМІШУВАЧІ", description: "Subcategory title" })
    readonly title?: string;

    @ApiProperty({
        example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
        description: "Subcategory image",
    })
    readonly image?: string;
}
