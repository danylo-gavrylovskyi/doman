import { Product } from "src/products/product.entity";

export interface OrderedProduct {
	product: Product;
	quantity: number;
}
