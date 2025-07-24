"use client";

import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

import { Subcategory } from "@/types/category.interface";
import { Attribute, AttributeIdValuePair } from "@/types/attribute.interface";

import styles from "./AddProduct.module.scss";
import slugify from "slugify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetSubcategories } from "@/hooks/subcategories.hooks";
import { useGetAttributes } from "@/hooks/attributes.hooks";
import { useAddProduct } from "@/hooks/products.hooks";
import { CreateProductForm } from "@/types/product.interface";

const AddProduct = () => {
	const { push } = useRouter();

	const { register, handleSubmit } = useForm<CreateProductForm>();

	const [attributeCount, setAttributeCount] = React.useState<number>(1);
	const [attributeValues, setAttributeValues] = React.useState<AttributeIdValuePair[]>([]);

	const [image, setImage] = React.useState<File | null>();

	const { data: subcategories } = useGetSubcategories();
	const { data: attributes } = useGetAttributes();

	const addProduct = useAddProduct();

	const handleAttributeIdChange = (index: number, attributeId: string) => {
		const updatedAttrValues = [...attributeValues];
		updatedAttrValues[index] = [Number(attributeId), ""];
		setAttributeValues(updatedAttrValues);
	};
	const handleAttributeValueChange = (index: number, attributeValue: string) => {
		const updatedAttrValues = [...attributeValues];
		updatedAttrValues[index][1] = attributeValue;
		setAttributeValues(updatedAttrValues);
	};

	const onSaveProduct: SubmitHandler<CreateProductForm> = (values) => {
		const { article, title, description, quantity, price, subcategoryId } = values;

		const formData = new FormData();
		formData.append("article", article);
		formData.append("title", title);
		formData.append("description", description);
		formData.append("quantity", String(quantity));
		formData.append("price", String(price));
		formData.append("subcategoryId", String(subcategoryId));
		formData.append("slug", slugify(title));
		image && formData.append("image", image);
		formData.append("attributeValues", JSON.stringify(attributeValues));

		addProduct(formData);
		push("/admin/products");
	};

	if (!subcategories || !attributes) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<header className={styles.heading}>Додавання товару</header>
			<form onSubmit={handleSubmit(onSaveProduct)} className={styles.form}>
				<main>
					<section>
						<TextField {...register("title")} name="title" fullWidth label="Назва" />
						<TextField {...register("article")} name="article" fullWidth label="Артикул" />
					</section>
					<section>
						<TextField
							{...register("subcategoryId")}
							name="subcategoryId"
							className={styles.select}
							label="Підкатегорія"
							select>
							{subcategories.map((subcategory: Subcategory) => (
								<MenuItem key={subcategory.id} value={subcategory.id}>
									{subcategory.title}
								</MenuItem>
							))}
						</TextField>
						<TextField
							{...register("quantity")}
							name="quantity"
							type="number"
							label="Кількість"
						/>
						<TextField {...register("price")} name="price" type="number" label="Ціна" />
						<label className={styles.loadImg}>
							Обкладинка
							<input
								onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
								name="image"
								type="file"></input>
						</label>
					</section>
					<section>
						<TextField
							{...register("description")}
							name="description"
							fullWidth
							label="Опис"
						/>
					</section>
					{[...Array(attributeCount)].map((el, index: number) => (
						<section key={index}>
							<TextField
								onChange={(e) => handleAttributeIdChange(index, e.target.value)}
								className={styles.select}
								label="Атрибут"
								select>
								{attributes.map((attribute: Attribute) => (
									<MenuItem key={attribute.id} value={attribute.id}>
										{attribute.title}
									</MenuItem>
								))}
							</TextField>
							<TextField
								onChange={(e) => handleAttributeValueChange(index, e.target.value)}
								fullWidth
								label="Значення"
							/>
							{index === attributeCount - 1 && (
								<button
									className={styles.deleteAttribute}
									type="button"
									onClick={() => setAttributeCount((prev) => --prev)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="30px"
										height="30px"
										viewBox="0 0 24 24"
										fill="none">
										<path
											d="M19 5L5 19M5.00001 5L19 19"
											stroke="#000000"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}
						</section>
					))}
					<footer>
						<button type="submit">Зберегти</button>
						<button type="button" onClick={() => setAttributeCount((prev) => ++prev)}>
							Додати атрибут
						</button>
					</footer>
				</main>
			</form>
		</>
	);
};

export default AddProduct;
