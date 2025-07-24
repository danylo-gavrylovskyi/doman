import React from "react";
import { useDispatch } from "react-redux";

import { addToCart, removeFromCart, removeOneUnit } from "@/redux/features/cartSlice";

import { CartProduct } from "@/types/product.interface";

import styles from "./CartProductCard.module.scss";

export const CartProductCard = (props: CartProduct) => {
	const { title, price, image, id } = props.product;
	const dispatch = useDispatch();
	return (
		<div className={styles.container}>
			<img
				width={"25%"}
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${image}`}
				alt="product"></img>
			<div className={styles.infoAndControls}>
				<div className={styles.titleAndClearBtns}>
					<span>{title}</span>
					<button
						onClick={() => dispatch(removeFromCart(id))}
						className={styles.removeProduct}
						data-testid="removeProduct">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30px"
							height="30px"
							viewBox="0 0 24 24"
							fill="none">
							<path
								d="M19 5L5 19M5.00001 5L19 19"
								stroke="#000000"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
				<div className={styles.controlQuantityBtns}>
					<button onClick={() => dispatch(addToCart(props.product))}>+</button>
					<div>{props.quantity}</div>
					<button onClick={() => dispatch(removeOneUnit(id))}>-</button>
					<span className={styles.price}>{price * props.quantity}грн.</span>
				</div>
			</div>
		</div>
	);
};
