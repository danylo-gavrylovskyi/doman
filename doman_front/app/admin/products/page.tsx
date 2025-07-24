"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useExcelTable, useGetProductsWithPagination } from "@/hooks/products.hooks";

import { AdminProduct } from "@/components/Admin/AdminProduct";
import { Pagination } from "@/components/Pagination/Pagination";
import { Search } from "@/components/Search/Search";

import { Product } from "@/types/product.interface";

import styles from "./AdminProducts.module.scss";

const AdminProducts = () => {
	const [inputValue, setInputValue] = React.useState<string>("");

	const addProductsViaExcel = useExcelTable();

	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const { data: products } = useGetProductsWithPagination({ page, perPage, inputValue });

	return (
		<>
			<header className={styles.header}>
				<Link href={"/admin/products/new"}>
					<button>Додати новий товар</button>
				</Link>
				<Search inputValue={inputValue} onChangeInput={(e) => setInputValue(e.target.value)} />
				<label className={styles.loadImg}>
					Завантажити таблицю
					<input
						onChange={(e) => {
							const formData = new FormData();
							e.target.files &&
								e.target.files[0] &&
								formData.append("file", e.target.files[0]);
							e.target.files && e.target.files[0] && addProductsViaExcel(formData);
						}}
						name="image"
						type="file"></input>
				</label>
			</header>
			<main className={styles.main}>
				{products ? (
					products.rows.map((product: Product) => (
						<AdminProduct key={product.id} {...product} />
					))
				) : (
					<div>Loading...</div>
				)}
				<footer>
					<Pagination
						pageQuantity={
							perPage && products
								? products.count / +perPage < 1
									? 1
									: Math.ceil(products.count / +perPage)
								: 1
						}
						currentPage={page ? +page : 1}
					/>
				</footer>
			</main>
		</>
	);
};

export default AdminProducts;
