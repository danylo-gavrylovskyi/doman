import { Paper } from "@mui/material";
import Image from "next/image";
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
			}
			className={styles.linkWrapper}
		>
			<Paper elevation={3} className={styles.container}>
				<div className={styles.imageWrapper}>
					<Image
						src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageFolder}/${image}`}
						alt={title}
						fill
						sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 10vw"
						style={{ objectFit: "contain" }}
					/>
				</div>
				<span>{title}</span>
			</Paper>
		</Link>
	);
};
