"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { changeCartStatus } from "../../redux/features/cartSlice";
import { RootState } from "@/redux/store";

import { CartProduct } from "@/types/product.interface";

import { CartProductCard } from "@/components/CartProductCard/CartProductCard";

import { getCartTotalPrice } from "@/utils/getCartTotalPrice";

import styles from "./Cart.module.scss";

export const Cart = () => {
	const dispatch = useDispatch();
	const isCartOpened: boolean = useSelector((state: RootState) => state.cart.isOpened);
	const cartProducts: CartProduct[] = useSelector((state: RootState) => state.cart.cartProducts);

	let cartTotalPrice: number = getCartTotalPrice(cartProducts);

	return (
		<>
			<div
				onClick={() => dispatch(changeCartStatus())}
				className={`${styles.darkBg} ${isCartOpened ? styles.visible : styles.hidden}`}></div>
			<div className={`${styles.container} ${isCartOpened ? styles.open : styles.close}`}>
				<header className={styles.header}>
					<svg
						onClick={() => dispatch(changeCartStatus())}
						className={styles.cartArrow}
						width="40px"
						height="40px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<g strokeWidth="0"></g>
						<g strokeLinecap="round" strokeLinejoin="round"></g>
						<g>
							<path
								d="M10 7L15 12L10 17"
								stroke="#fff"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"></path>
						</g>
					</svg>
					<span>Корзина</span>
				</header>
				<div className={styles.products}>
					{cartProducts.map((cartProduct: CartProduct) => (
						<CartProductCard key={cartProduct.product.id} {...cartProduct} />
					))}
				</div>
				{cartProducts.length ? (
					<footer>
						<div className={styles.totalPrice}>
							<span>Разом:</span>
							<span>{cartTotalPrice}грн.</span>
						</div>
						<Link href="/checkout">
							<button
								onClick={() => dispatch(changeCartStatus())}
								className={styles.makeOrderBtn}>
								Оформити замовлення
							</button>
						</Link>
					</footer>
				) : (
					""
				)}
			</div>
		</>
	);
};
