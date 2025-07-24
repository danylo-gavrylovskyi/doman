"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import slugify from "slugify";

import { Subcategory } from "@/types/category.interface";

import { AdminCategory } from "@/components/Admin/AdminCategory/AdminCategory";
import { AdminPageLayout } from "@/modules/Admin/AdminPageLayout/AdminPageLayout";

import {
	useAddSubcategory,
	useDeleteSubcategory,
	useEditSubcategory,
	useGetSubcategoriesWithPagination,
} from "@/hooks/subcategories.hooks";
import { useGetCategories } from "@/hooks/categories.hooks";

const Subcategories = () => {
	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const [isAddingCategory, changeAddingMode] = React.useState<boolean>(false);

	const { data: subcategories } = useGetSubcategoriesWithPagination({ page, perPage });
	const { data: categories } = useGetCategories();

	const addSubcategory = useAddSubcategory();
	const editSubcategory = useEditSubcategory();
	const deleteSubcategory = useDeleteSubcategory();

	const onSaveCategory = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const categoryId: string = (
			(event.target as HTMLFormElement).elements.namedItem("categoryId") as HTMLInputElement
		).value;

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
		formData.append("categoryId", categoryId);
		if (image === null) {
			throw new Error("You didnt choose the file");
		}
		formData.append("image", image);

		addSubcategory(formData);
		changeAddingMode((prev) => !prev);
	};

	if (!subcategories || !categories) {
		return <div>Loading...</div>;
	}

	return (
		<AdminPageLayout
			isAdding={isAddingCategory}
			onSaveForm={onSaveCategory}
			changeAddingMode={changeAddingMode}
			isInputNeeded={true}
			isSelectNeeded={true}
			categories={categories}
			createBtnText="Додати підкатегорію"
			inputText="Назва нової підкатегорії"
			insertImgText="Завантажити обкладинку"
			page={page}
			perPage={perPage}
			elementsCount={subcategories.count}>
			<>
				{subcategories.rows.map((subcategory: Subcategory) => (
					<AdminCategory
						key={subcategory.id}
						edit={editSubcategory}
						deleteItem={deleteSubcategory}
						subcategoryParent={categories.find(
							(category) => category.id === subcategory.categoryId
						)}
						{...subcategory}
					/>
				))}
			</>
		</AdminPageLayout>
	);
};

export default Subcategories;
