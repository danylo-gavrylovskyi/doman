import React from "react";
import Link from "next/link";
import { Paper } from "@mui/material";

import { Product } from "@/types/product.interface";

import styles from "./HeaderProducts.module.scss";

export const HeaderProduct = (product: Product) => {
	return (
		<Link href={`products/${product.slug}`}>
			<Paper elevation={3} className={styles.container}>
				<img
					width={"20%"}
					alt="product"
					src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${product.image}`}></img>
				<div>
					<p>{product.title}</p>
					<p>{product.price}грн.</p>
				</div>
			</Paper>
		</Link>
	);
};
