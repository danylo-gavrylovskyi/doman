"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";
import { AdminHeader } from "@/components/Admin/AdminHeader/AdminHeader";
import { Pagination } from "@/components/Pagination/Pagination";
import { Search } from "@/components/Search/Search";

import {
	useDeleteSubcategory,
	useGetSubcategoriesWithPagination,
} from "@/hooks/subcategories.hooks";

import { sanitizePagination } from "@/utils/sanitizePagination";

import { Subcategory } from "@/types/category.interface";
import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";

import styles from "./admin-subcategories.module.scss"

const Subcategories = () => {
	const [inputValue, setInputValue] = React.useState<string>("");

	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: subcategories } = useGetSubcategoriesWithPagination({ page, perPage, inputValue });

	const deleteSubcategory = useDeleteSubcategory();

	return (
		<>
			<AdminHeader
				addBtnText="Додати підкатегорію"
				perPage={perPage}
				entityName="subcategories"
			>
				<Search inputValue={inputValue} onChangeInput={(e) => setInputValue(e.target.value)} />
			</AdminHeader>

			<div className={styles.content}>
				{subcategories ? (
					subcategories.rows.map((subcategory: Subcategory) => (
						<AdminCategory
							key={subcategory.id}
							linkToUpdatePage={`/admin/subcategories/${subcategory.id}`}
							deleteItem={deleteSubcategory}
							subcategoryParent={subcategory.category}
							{...subcategory}
						/>
					)))
					:
					(<div>Loading...</div>)
				}
			</div>

			<footer>
				<Pagination
					elementsCount={subcategories?.count ?? 0}
					perPage={perPage}
					currentPage={page}
				/>
			</footer>
		</>
	);
};

export default Subcategories;
