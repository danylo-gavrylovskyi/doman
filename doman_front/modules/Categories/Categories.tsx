import React from "react";

import { Category } from "@/types/category.interface";

import { CategoryCard } from "../../components/CategoryCard/CategoryCard";

import styles from "./Categories.module.scss";

export const Categories = ({ categories }: { categories: Category[] }) => {
	if (!categories) {
		return <div>Loading...</div>;
	}

	return (
		<div className={styles.container}>
			<p>Категорії товарів</p>
			<div className={styles.grid}>
				{categories.map((category: Category) => (
					<CategoryCard key={category.id} {...category} />
				))}
			</div>
		</div>
	);
};
