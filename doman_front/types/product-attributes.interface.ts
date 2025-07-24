export interface ProductAttribute {
	id: number;
	productId: number;
	attributeId: number;
	attributeValue: string;
}

export interface CreateProductAttribute {
	productId: number;
	attributeId: number;
	attributeValue: string;
}
