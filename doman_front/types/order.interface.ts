import { CartProduct, Product } from "@/types/product.interface";

export interface Order {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	orderedProducts: CartProduct[];
	totalPrice: number;
}

export interface ExtendedOrder extends Omit<Order, "orderedProducts"> {
	id: number;
	orderProducts: OrderProduct[];
	createdAt: Date;
}

export interface PaginationOrders {
	rows: ExtendedOrder[];
	count: number;
}

export interface OrderProduct {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	product: Product;
}
