import React from "react";
import { Paper } from "@mui/material";

import { HeaderProduct } from "./HeaderProduct";

import { Product } from "@/types/product.interface";

import styles from "./HeaderProducts.module.scss";

export const HeaderProducts = ({ products }: { products: Product[] }) => {
	return (
		<>
			<div className={styles.darkBg}></div>
			<Paper className={styles.paper}>
				{products.map((product) => (
					<HeaderProduct key={product.id} {...product} />
				))}
			</Paper>
		</>
	);
};
