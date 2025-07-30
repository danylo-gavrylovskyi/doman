import { PaginatedEntityRequestDto } from "src/shared/paginatedEntity.dto";

export class GetByPhoneNumberPaginationDto extends PaginatedEntityRequestDto {
	readonly phoneNumber: string;
}
