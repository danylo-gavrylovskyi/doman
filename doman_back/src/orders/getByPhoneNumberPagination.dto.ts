import { PaginatedEntityRequestDto } from "src/common/paginatedEntity.dto";

export class GetByPhoneNumberPaginationDto extends PaginatedEntityRequestDto {
	readonly phoneNumber: string;
}
