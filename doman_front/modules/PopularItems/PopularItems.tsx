import React from "react";

import { Product } from "@/types/product.interface";

import { Item } from "../../components/Item/Item";

import styles from "./PopularItems.module.scss";

export const PopularItems = ({ products }: { products: Product[] }) => {
	if (!products.length) {
		return null;
	}

	return (
		<div className={styles.container}>
			<p>Популярні товари</p>
			<main className={styles.mainGrid}>
				{products.map((product) => (
					<Item key={product.id} {...product}></Item>
				))}
			</main>
		</div>
	);
};
