"use client";

import React from "react";
import { useDispatch } from "react-redux";

import { addToCart } from "@/redux/features/cartSlice";

import { Product } from "@/types/product.interface";

import styles from "./ProductPage.module.scss";

export const AddToCartButton = ({ product }: { product: Product }) => {
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => dispatch(addToCart(product))}
			className={styles.addToCart}
			disabled={product.quantity === 0}>
			Додати
		</button>
	);
};
