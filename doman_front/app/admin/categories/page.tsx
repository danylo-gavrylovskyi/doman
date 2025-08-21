"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";
import { AdminHeader } from "@/components/Admin/AdminHeader/AdminHeader";
import { Pagination } from "@/components/Pagination/Pagination";
import { Search } from "@/components/Search/Search";

import {
	useDeleteCategory,
	useGetCategoriesWithPagination,
} from "@/hooks/categories.hooks";

import { sanitizePagination } from "@/utils/sanitizePagination";

import { Category } from "@/types/category.interface";
import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";

import styles from "./admin-categories.module.scss"

const Categories = () => {
	const [inputValue, setInputValue] = React.useState<string>("");

	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: categories } = useGetCategoriesWithPagination({ page, perPage, inputValue });

	const { mutate: deleteCategory } = useDeleteCategory();

	return (
		<>
			<AdminHeader
				addBtnText="Додати категорію"
				perPage={perPage}
				entityName="categories"
			>
				<Search inputValue={inputValue} onChangeInput={(e) => setInputValue(e.target.value)} />
			</AdminHeader>

			<div className={styles.content}>
				{categories ? (
					categories.rows.map((category: Category) => (
						<AdminCategory
							key={category.id}
							linkToUpdatePage={`/admin/categories/${category.id}`}
							deleteItem={deleteCategory}
							{...category}
						/>
					))
				) : (
					<div>Loading...</div>
				)}

			</div>

			<footer>
				<Pagination
					elementsCount={categories?.count ?? 0}
					perPage={perPage}
					currentPage={page}
				/>
			</footer>
		</>
	);
};

export default Categories;
