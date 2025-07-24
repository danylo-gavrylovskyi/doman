import React from "react";
import { Button, Paper } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

import { Category, Subcategory } from "@/types/category.interface";

import styles from "./AdminCategory.module.scss";

interface AdminCategoryProps extends Category {
	subcategoryParent?: Category;
	edit:
	| UseMutateFunction<
		Category,
		unknown,
		{
			id: number;
			formData: FormData;
		},
		unknown
	>
	| UseMutateFunction<
		Subcategory,
		unknown,
		{
			id: number;
			formData: FormData;
		},
		unknown
	>;
	deleteItem: UseMutateFunction<number, unknown, number, unknown>;
}

export const AdminCategory = ({
	id,
	title,
	image,
	edit,
	deleteItem,
	subcategoryParent,
}: AdminCategoryProps) => {
	const { register, handleSubmit } = useForm<{ title: string }>();

	const [isEditing, changeEditingMode] = React.useState<boolean>(false);

	const [uploadedImage, setImage] = React.useState<File | null>();

	const onSaveEditCategory: SubmitHandler<{ title: string }> = (values) => {
		const formData = new FormData();

		values.title && formData.append("title", values.title);
		uploadedImage && formData.append("image", uploadedImage);

		edit({ id, formData });
		changeEditingMode((prev) => !prev);
	};

	return (
		<Paper elevation={3} className={styles.container}>
			<img
				style={isEditing ? { display: "none" } : { display: "block" }}
				width={"8%"}
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${subcategoryParent ? "subcategoriesImages" : "categoriesImages"
					}/${image}`}></img>

			<form
				style={isEditing ? { display: "flex" } : {}}
				className={styles.form}
				onSubmit={handleSubmit(onSaveEditCategory)}
				role="form"
				aria-label="Edit category form">
				<label className={styles.newImgLabel} htmlFor="newCategoryImg">
					Нова обкладинка
					<input
						onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
						name="image"
						id="newCategoryImg"
						type="file"></input>
				</label>

				<input
					{...register("title")}
					className={styles.newTitleInput}
					name="title"
					placeholder="Введіть нову назву"></input>

				<Button type="submit" variant="contained">
					Зберегти
				</Button>
			</form>

			<p style={isEditing ? { display: "none" } : { display: "block" }}>
				{subcategoryParent ? `${title} (${subcategoryParent?.title})` : title}
			</p>

			<Button
				onClick={() => changeEditingMode((prev) => !prev)}
				style={isEditing ? { display: "none" } : { display: "block" }}
				variant="contained">
				Змінити
			</Button>
			<Button onClick={() => deleteItem(id)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
