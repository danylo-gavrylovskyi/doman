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
				{/* Image */}
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

				{/* Main Details */}
				<div className={styles.details}>
					<p className={styles.title}>{product.title}</p>
					<p className={styles.price}>{product.price} грн.</p>
					<p className={`${styles.stock} ${product.quantity <= 0 && styles.out}`}>
						{product.quantity > 0 ? `В наявності: ${product.quantity} шт.` : 'Немає в наявності'}
					</p>
					<p className={styles.descr}>{product.description}</p>

					<button
						onClick={() => dispatch(addToCart(product))}
						className={styles.addToCart}
						disabled={product.quantity === 0}
					>
						Додати
					</button>

					{/* Extra details */}
					<div className={styles.extraDetails}>
						<h3>Характеристики</h3>
						<ul>
							{product.attributes?.map((productAttr) => (
								<li key={productAttr.id}>
									<strong>{productAttr.attribute?.title}:</strong> {productAttr.attributeValue}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
