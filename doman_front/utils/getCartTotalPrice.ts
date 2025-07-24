import { CartProduct } from "@/types/product.interface";

export const getCartTotalPrice = (cartProducts: CartProduct[]): number => {
	return cartProducts.reduce((prev, cur) => prev + cur.product.price * cur.quantity, 0);
};
