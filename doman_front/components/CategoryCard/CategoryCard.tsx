import { Paper } from "@mui/material";
import Link from "next/link";
import React from "react";

import { Category } from "@/types/category.interface";

import styles from "./CategoryCard.module.scss";

interface CategoryCardProps extends Omit<Category, "id"> {
	imageFolder?: string;
}

export const CategoryCard = ({
	title,
	slug,
	image,
	imageFolder = "categoriesImages",
}: CategoryCardProps) => {
	return (
		<Link
			href={
				imageFolder !== "categoriesImages" ? `/subcategories/${slug}` : `/categories/${slug}`
			}>
			<Paper elevation={3} className={styles.container}>
				<img
					width={"20%"}
					alt="category"
					src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageFolder}/${image}`}></img>
				<span>{title}</span>
			</Paper>
		</Link>
	);
};
