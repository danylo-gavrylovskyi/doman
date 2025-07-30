export interface Category {
	id: number;
	title: string;
	slug: string;
	image: string;
	subcategories?: Subcategory[];
}

export interface Subcategory {
	id: number;
	title: string;
	slug: string;
	image: string;
	categoryId: number;
	category?: Category;
}

export interface PaginationSubcategory {
	rows: Subcategory[];
	count: number;
}

export interface PaginationCategory {
	rows: Category[];
	count: number;
}
