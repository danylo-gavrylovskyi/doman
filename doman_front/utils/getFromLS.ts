import { CartProduct } from "../types/product.interface";

export const getCartFromLS = (): CartProduct[] => {
	let cart;
	if (typeof window !== "undefined") {
		cart = localStorage.getItem("cart");
	}
	return JSON.parse(cart || "[]");
};
