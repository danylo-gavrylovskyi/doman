import React from "react";
import Link from "next/link";

import { Category } from "@/types/category.interface";

import styles from "./DropdownCategory.module.scss";

export const DropdownCategory = ({ title, image, slug }: Category) => {
	return (
		<Link href={`/categories/${slug}`}>
			<div className={styles.container}>
				<img
					width="20%"
					src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categoriesImages/${image}`}></img>
				<p>{title}</p>
			</div>
		</Link>
	);
};
