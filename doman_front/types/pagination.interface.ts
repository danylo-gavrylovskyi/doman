import { AttributeWithValues } from "./attribute.interface";

export interface Pagination {
	page?: string;
	perPage?: string;
	inputValue?: string;
	categoryId?: number;
	subcategoryId?: number;
	filterParams?: AttributeWithValues[];
}

export interface PaginationWithPhoneNumber extends Pagination {
	phoneNumber: string;
}
