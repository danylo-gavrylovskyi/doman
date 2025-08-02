"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { AdminAttribute } from "@/components/Admin/AdminAttribute/AdminAttribute";

import {
	useDeleteAttribute,
	useGetAttributesWithPagination,
} from "@/hooks/attributes.hooks";

import { Attribute } from "@/types/attribute.interface";
import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";

import { sanitizePagination } from "@/utils/sanitizePagination";
import { AdminHeader } from "@/components/Admin/AdminHeader/AdminHeader";
import { Pagination } from "@/components/Pagination/Pagination";

import styles from "./admin-attributes.module.scss"
import { Search } from "@/components/Search/Search";

const Attributes = () => {
	const [inputValue, setInputValue] = React.useState<string>("");

	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: attributes } = useGetAttributesWithPagination({ page, perPage, inputValue });

	const { mutate: deleteAttribute } = useDeleteAttribute();

	return (
		<>
			<AdminHeader
				addBtnText="Додати новий атрибут"
				perPage={perPage}
				entityName="attributes"
			>
				<Search inputValue={inputValue} onChangeInput={(e) => setInputValue(e.target.value)} />
			</AdminHeader>

			<div className={styles.content}>
				{attributes ?
					(attributes.rows.map((attribute: Attribute) => (
						<AdminAttribute
							key={attribute.id}
							deleteAttribute={deleteAttribute}
							{...attribute}
						/>
					)))
					:
					(<div>Loading...</div>)
				}
			</div>

			<footer>
				<Pagination
					elementsCount={attributes?.count ?? 0}
					perPage={perPage}
					currentPage={page}
				/>
			</footer>
		</>
	);
};

export default Attributes;
