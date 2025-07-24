import { CartProduct } from "@/types/product.interface";

export const setCartInLS = (cart: CartProduct[]) => {
	localStorage.setItem("cart", JSON.stringify(cart));
};
