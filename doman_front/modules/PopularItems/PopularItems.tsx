"use client";

import React from "react";

import { Item } from "../../components/Item/Item";

import styles from "./PopularItems.module.scss";
import { useGetProducts } from "@/hooks/products.hooks";

export const PopularItems = () => {
	const { data: products } = useGetProducts({ where: { isPopular: true } });

	if (!products) {
		return <div>Loading...</div>;
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
