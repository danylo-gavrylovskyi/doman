export interface Pagination {
	page?: string;
	perPage?: string;
	inputValue?: string;
}

export interface PaginationWithPhoneNumber extends Pagination {
	phoneNumber: string;
}
