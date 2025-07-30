export interface Attribute {
	id: number;
	title: string;
	attributeId: number;
	attributeValue: string;
}

export type AttributeIdValuePair = [attributeId: number, value: string];

export interface AttributeWithValues {
	title: string;
	values: string[];
}

export interface AttributeWithValue {
	title: string;
	value: string;
}

export interface PaginationAttribute {
	rows: Attribute[];
	count: number;
}
