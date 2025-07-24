import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CartProduct, Product } from '@/types/product.interface';

interface CartSliceState {
	isOpened: boolean;
	cartProducts: CartProduct[];
}

const initialState: CartSliceState = {
	isOpened: false,
	cartProducts: [],
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		changeCartStatus: (state) => {
			state.isOpened = !state.isOpened;
		},
		addToCart: (state, action: PayloadAction<Product>) => {
			const foundProduct = state.cartProducts.find(
				(obj) => obj.product.id === action.payload.id
			);
			if (foundProduct) {
				foundProduct.quantity++;
			} else {
				state.cartProducts.push({ product: action.payload, quantity: 1 });
			}
		},
		removeOneUnit: (state, action: PayloadAction<number>) => {
			const foundProduct = state.cartProducts.find(
				(obj) => obj.product.id === action.payload
			);
			if (foundProduct) {
				foundProduct.quantity === 1
					? (state.cartProducts = state.cartProducts.filter(
							(obj) => obj.product.id !== action.payload
					  ))
					: foundProduct.quantity--;
			}
		},
		removeFromCart: (state, action: PayloadAction<number>) => {
			state.cartProducts = state.cartProducts.filter(
				(obj) => obj.product.id !== action.payload
			);
		},
		clearCart: (state) => {
			state.cartProducts = [];
		},
	},
});

export const {
	changeCartStatus,
	addToCart,
	removeFromCart,
	removeOneUnit,
	clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
