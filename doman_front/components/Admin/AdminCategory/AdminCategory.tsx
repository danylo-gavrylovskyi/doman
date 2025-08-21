import { Button, Paper } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { Category } from "@/types/category.interface";

import styles from "./AdminCategory.module.scss";

interface AdminCategoryProps {
	id: number;
	title: string;
	image: string;
	linkToUpdatePage: string;
	subcategoryParent?: Category;
	deleteItem: UseMutateFunction<number, unknown, number, unknown>;
}

export const AdminCategory = ({
	id,
	title,
	image,
	linkToUpdatePage,
	deleteItem,
	subcategoryParent,
}: AdminCategoryProps) => {
	return (
		<Paper elevation={3} className={styles.container}>
			<Image
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${subcategoryParent ? "subcategoriesImages" : "categoriesImages"}/${image}`}
				alt={title}
				width={80}
				height={80}
				style={{ objectFit: "contain" }}
			/>

			<p>
				{subcategoryParent ? `${title} (${subcategoryParent?.title})` : title}
			</p>

			<Link href={linkToUpdatePage}>
				<Button variant="contained">Змінити</Button>
			</Link>

			<Button onClick={() => deleteItem(id)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
