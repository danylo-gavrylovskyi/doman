import React from "react";
import { Button, Paper } from "@mui/material";
import Link from "next/link";

import { useDeleteProduct } from "@/hooks/products.hooks";
import { useGetSubcategories } from "@/hooks/subcategories.hooks";

import { Product } from "@/types/product.interface";

import styles from "./AdminCategory/AdminCategory.module.scss";

export const AdminProduct = ({
	id,
	title,
	quantity,
	price,
	image,
	article,
	subcategoryId,
}: Product) => {
	const subcategory = useGetSubcategories().data?.find(
		(subcategory) => subcategory.id === subcategoryId
	);

	const deleteProduct = useDeleteProduct();

	return (
		<Paper elevation={3} className={styles.container}>
			<img
				width={"15%"}
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${image}`}></img>
			<div className={styles.productInfo}>
				<p>Назва: {title}</p>
				<p>Артикул: {article}</p>
				<p>Кількість: {quantity}шт.</p>
				<p>Ціна: {price}грн</p>
				<p>Підкатегорія: {subcategory?.title}</p>
			</div>

			<Link href={`/admin/products/${id}`}>
				<Button variant="contained">Змінити</Button>
			</Link>
			<Button onClick={() => deleteProduct(id)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
