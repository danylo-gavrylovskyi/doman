"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { AdminPageLayout } from "@/modules/Admin/AdminPageLayout/AdminPageLayout";

import { AdminAttribute } from "@/components/Admin/AdminAttribute/AdminAttribute";

import {
	useAddAttribute,
	useDeleteAttribute,
	useGetAttributesWithPagination,
} from "@/hooks/attributes.hooks";

import { Attribute } from "@/types/attribute.interface";
import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";

import { sanitizePagination } from "@/utils/sanitizePagination";

const Attributes = () => {
	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const [isAddingAttribute, changeAddingMode] = React.useState<boolean>(false);

	const { data: attributes } = useGetAttributesWithPagination({ page, perPage });

	const { mutate: addAttribute } = useAddAttribute();
	const { mutate: deleteAttribute } = useDeleteAttribute();

	const onSaveAttribute = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const title: string = (
			(event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
		).value;

		addAttribute(title);
		changeAddingMode((prev) => !prev);
	};

	if (!attributes) {
		return <div>Loading...</div>;
	}

	return (
		<AdminPageLayout
			isAdding={isAddingAttribute}
			onSaveForm={onSaveAttribute}
			changeAddingMode={changeAddingMode}
			isImageInputNeeded={false}
			isInputNeeded={true}
			inputText="Назва атрибуту"
			createBtnText="Додати атрибут"
			page={page}
			perPage={perPage}
			elementsCount={attributes.count}>
			<>
				{attributes.rows.map((attribute: Attribute) => (
					<AdminAttribute
						key={attribute.id}
						deleteAttribute={deleteAttribute}
						{...attribute}
					/>
				))}
			</>
		</AdminPageLayout>
	);
};

export default Attributes;
