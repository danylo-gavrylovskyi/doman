"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import slugify from "slugify";

import {
	useAddCategory,
	useDeleteCategory,
	useEditCategory,
	useGetCategoriesWithPagination,
} from "@/hooks/categories.hooks";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";
import { AdminPageLayout } from "@/modules/Admin/AdminPageLayout/AdminPageLayout";

import { Category } from "@/types/category.interface";

const Categories = () => {
	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const [isAddingCategory, changeAddingMode] = React.useState<boolean>(false);

	const {
		data: categories,
		isLoading,
		isError,
	} = useGetCategoriesWithPagination({ page, perPage });

	const { mutate: addCategory } = useAddCategory();
	const { mutate: editCategory } = useEditCategory();
	const { mutate: deleteCategory } = useDeleteCategory();

	const onSaveCategory = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const title: string = (
			(event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement
		).value;

		const fileInput = (event.target as HTMLFormElement).elements.namedItem(
			"image"
		) as HTMLInputElement;

		const image = fileInput?.files ? fileInput.files[0] : null;

		const formData = new FormData();
		formData.append("title", title);
		formData.append("slug", slugify(title));
		if (image === null) {
			throw new Error("You didnt choose the file");
		}
		formData.append("image", image);

		addCategory(formData);
		changeAddingMode((prev) => !prev);
	};

	if (!categories || isLoading || isError) {
		return <div>Loading...</div>;
	}

	return (
		<AdminPageLayout
			isAdding={isAddingCategory}
			onSaveForm={onSaveCategory}
			changeAddingMode={changeAddingMode}
			isInputNeeded={true}
			createBtnText="Додати категорію"
			inputText="Назва нової категорії"
			insertImgText="Завантажити обкладинку"
			page={page}
			perPage={perPage}
			elementsCount={categories.count}>
			<>
				{categories.rows.map((category: Category) => (
					<AdminCategory
						key={category.id}
						edit={editCategory}
						deleteItem={deleteCategory}
						{...category}
					/>
				))}
			</>
		</AdminPageLayout>
	);
};

export default Categories;
