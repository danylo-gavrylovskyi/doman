"use client";

import React from "react";
import { Paper } from "@mui/material";
import Link from "next/link";

import { useAppDispatch } from "@/redux/store";
import { addToCart } from "@/redux/features/cartSlice";

import { Product } from "@/types/product.interface";

import styles from "./Item.module.scss";

export const Item = (product: Product) => {
	const dispatch = useAppDispatch();

	return (
		<>
			<Paper
				elevation={3}
				style={{ display: "flex", flexDirection: "column", position: "relative" }}>
				<Link href={`/products/${product.slug}`}>
					<section className={styles.imgBg}>
						<img
							width="100%"
							src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${product.image}`}
							alt="item"></img>
					</section>
				</Link>
				<section>
					<div className={styles.title}>
						<Link href={`/products/${product.slug}`}>
							<span>{product.title}</span>
						</Link>
					</div>
					<div className={styles.buyBtnAndPrice}>
						<button onClick={() => dispatch(addToCart(product))} className={styles.addToCart}>
							Додати
						</button>
						<span>{product.price}грн.</span>
					</div>

					{product.quantity <= 0 && <p className={styles.notInStockText}>Немає в наявності</p>}
				</section>

				{product.quantity <= 0 && (
					<Link href={`/products/${product.slug}`}>
						<div className={styles.cardBackgroundTint} data-testid="tint-overlay"></div>
					</Link>
				)}
			</Paper>
		</>
	);
};
