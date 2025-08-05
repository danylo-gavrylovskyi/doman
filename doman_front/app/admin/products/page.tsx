"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { AdminHeader } from "@/components/Admin/AdminHeader/AdminHeader";
import { AdminProduct } from "@/components/Admin/AdminProduct";
import { Pagination } from "@/components/Pagination/Pagination";
import { Search } from "@/components/Search/Search";

import { useExcelTable, useGetProductsWithPagination } from "@/hooks/products.hooks";

import { sanitizePagination } from "@/utils/sanitizePagination";

import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";
import { Product } from "@/types/product.interface";

import styles from "./AdminProducts.module.scss";

const AdminProducts = () => {
	const [inputValue, setInputValue] = React.useState<string>("");

	const addProductsViaExcel = useExcelTable();

	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: products } = useGetProductsWithPagination({ page, perPage, inputValue });

	return (
		<>
			<AdminHeader
				addBtnText="Додати товар"
				perPage={perPage}
				entityName="products"
			>
				<Search inputValue={inputValue} onChangeInput={(e) => setInputValue(e.target.value)} />

				<label className={styles.loadImg}>
					Excel
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
			</AdminHeader>

			<main className={styles.main}>
				{products ? (
					products.rows.map((product: Product) => (
						<AdminProduct key={product.id} {...product} />
					))
				) : (
					<div>Loading...</div>
				)}
			</main>

			<footer>
				<Pagination
					elementsCount={products?.count ?? 0}
					perPage={perPage}
					currentPage={page}
				/>
			</footer>
		</>
	);
};

export default AdminProducts;
