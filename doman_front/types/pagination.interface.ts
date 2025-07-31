import { AttributeWithValues } from "./attribute.interface";

export interface Pagination {
	page?: number;
	perPage?: number;
	inputValue?: string;
	categoryId?: number;
	subcategoryId?: number;
	filterParams?: AttributeWithValues[];
}

export interface PaginationWithPhoneNumber extends Pagination {
	phoneNumber: string;
}
