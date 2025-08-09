"use client";

import { Paper } from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

import { addToCart } from "@/redux/features/cartSlice";

import { useGetProductBySlug } from "@/hooks/products.hooks";

import styles from "./ProductPage.module.scss";

const ProductPage = () => {
	const dispatch = useDispatch();

	const productSlug: string = useParams().product as string;
	const { data: product } = useGetProductBySlug(productSlug);

	if (!product) return <div>Loading...</div>;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<Paper elevation={16} className={styles.paper}>
					<Image
						src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${product.image}`}
						alt={product.slug}
						width={500}
						height={400}
						sizes="(max-width: 768px) 100vw, 500px"
						style={{
							width: '100%',
							height: 'auto',
							maxHeight: '400px',
							objectFit: 'contain',
							borderRadius: '10px'
						}}
					/>
				</Paper>
				<div className={styles.details}>
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
