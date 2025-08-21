import React from "react";
import { Paper } from "@mui/material";

import { HeaderProduct } from "./HeaderProduct";

import { Product } from "@/types/product.interface";

import styles from "./HeaderProducts.module.scss";

interface HeaderProductsProps {
	products: Product[],
	clearInputValue: () => void
}

export const HeaderProducts = ({ products, clearInputValue }: HeaderProductsProps) => {
	return (
		<>
			<div onClick={clearInputValue} className={styles.darkBg}></div>
			<Paper onClick={clearInputValue} className={styles.paper}>
				{products.map((product) => (
					<HeaderProduct key={product.id} {...product} />
				))}
			</Paper>
		</>
	);
};
