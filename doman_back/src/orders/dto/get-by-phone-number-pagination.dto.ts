import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";
import { PaginatedEntityRequestDto } from "src/common/dto/paginatedEntity.dto";

export class GetByPhoneNumberPaginationDto extends PaginatedEntityRequestDto {
	@ApiProperty({ example: "0630000000", description: "Customer's phone number" })
	@IsString()
	@IsPhoneNumber()
	readonly phoneNumber: string;
}
