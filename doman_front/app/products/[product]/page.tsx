"use client";

import React from "react";
import { Paper } from "@mui/material";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { addToCart } from "@/redux/features/cartSlice";

import { useGetProducts } from "@/hooks/products.hooks";

import styles from "./ProductPage.module.scss";

const ProductPage = () => {
	const dispatch = useDispatch();

	let productSlug: string = useParams().product as string;
	const product = useGetProducts().data?.find((prod) => prod.slug === productSlug);

	if (!product) return <div>Loading...</div>;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<Paper elevation={16} className={styles.paper}>
					<img
						src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${product.image}`}
						alt="productSlug"></img>
				</Paper>
				<div>
					<p className={styles.title}>{product.title}</p>
					<p className={styles.price}>{product.price}грн.</p>
					<p className={styles.descr}>{product.description}</p>
					<button onClick={() => dispatch(addToCart(product))} className={styles.addToCart}>
						Додати
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
