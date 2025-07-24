export interface Attribute {
	id: number;
	title: string;
	attributeId: number;
	attributeValue: string;
}

export type AttributeIdValuePair = [categoryId: number, value: string];

export interface PaginationAttribute {
	rows: Attribute[];
	count: number;
}
