"use client";

import React from "react";
import { Checkbox, MenuItem, TextField } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { useEditProduct, useGetProducts } from "@/hooks/products.hooks";
import { useGetAttributes } from "@/hooks/attributes.hooks";
import { useGetSubcategories } from "@/hooks/subcategories.hooks";

import { Subcategory } from "@/types/category.interface";
import { Attribute, AttributeIdValuePair } from "@/types/attribute.interface";
import { Product } from "@/types/product.interface";
import { UpdateProduct } from "@/types/update-product.interface";

import { findAttribute } from "@/utils/findAttribute";

import styles from "../new/AddProduct.module.scss";

const UpdateProductPage = () => {
	const { push } = useRouter();
	const { id } = useParams();

	const { register, handleSubmit } = useForm<UpdateProduct>();

	const product = useGetProducts().data?.find((product: Product) => product.id === Number(id));
	const { data: subcategories } = useGetSubcategories();
	const { data: attributes } = useGetAttributes();

	const editProduct = useEditProduct();

	const [image, setImage] = React.useState<File | null>();

	const [attributeCount, setAttributeCount] = React.useState<number>(0);
	const [newAttributeValues, setNewAttributeValues] = React.useState<AttributeIdValuePair[]>([]);
	const [oldAttributeValues, setOldAttributeValues] = React.useState<AttributeIdValuePair[]>([]);

	const handleAttributeIdChange = (index: number, attributeId: string) => {
		const updatedAttrValues = [...newAttributeValues];
		updatedAttrValues[index] = [Number(attributeId), ""];
		setNewAttributeValues(updatedAttrValues);
	};
	const handleAttributeValueChange = (index: number, attributeValue: string) => {
		const updatedAttrValues = [...newAttributeValues];
		updatedAttrValues[index][1] = attributeValue;
		setNewAttributeValues(updatedAttrValues);
	};

	const handleOldAttrChange = (attributeId: number, attributeValue: string) => {
		setOldAttributeValues((prev) => [...prev, [attributeId, attributeValue]]);
	};

	if (!product || !attributes || !subcategories) {
		return <div>Loading...</div>;
	}

	const onSaveProduct: SubmitHandler<UpdateProduct> = (values) => {
		const { title, article, quantity, subcategoryId, price, isPopular } = values;

		const formData = new FormData();
		if (title !== product.title) formData.append("title", title);
		if (article !== product.article) formData.append("article", article);
		if (isPopular !== product.isPopular) formData.append("isPopular", JSON.stringify(isPopular));
		if (Number(quantity) !== product.quantity) formData.append("quantity", String(quantity));
		if (Number(subcategoryId) !== product.subcategoryId)
			formData.append("subcategoryId", String(subcategoryId));
		if (+price !== +product.price) formData.append("price", String(price));
		if (image) formData.append("image", image);
		if (oldAttributeValues.length > 0)
			formData.append("oldAttributeValues", JSON.stringify(oldAttributeValues));
		if (newAttributeValues.length > 0)
			formData.append("newAttributeValues", JSON.stringify(newAttributeValues));

		editProduct({
			productId: product.id,
			formData,
		});
		push("/admin/products");
	};

	return (
		<>
			<header className={styles.heading}>Редагування товару</header>
			<form onSubmit={handleSubmit(onSaveProduct)} className={styles.form}>
				<main>
					<section>
						<TextField
							{...register("title")}
							defaultValue={product.title}
							name="title"
							fullWidth
							label="Назва"
						/>
						<TextField
							{...register("article")}
							defaultValue={product?.article}
							name="article"
							fullWidth
							label="Артикул"
						/>
					</section>
					<section>
						<TextField
							{...register("subcategoryId")}
							defaultValue={product.subcategoryId}
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
							defaultValue={product.quantity}
							name="quantity"
							type="number"
							label="Кількість"
						/>
						<TextField
							{...register("price")}
							defaultValue={product.price}
							name="price"
							type="number"
							label="Ціна"
						/>
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
							defaultValue={product.description}
							name="description"
							fullWidth
							label="Опис"
						/>
					</section>

					{product.attributes?.map((attribute: Attribute) => (
						<section key={attribute.id}>
							<TextField
								label="Атрибут"
								defaultValue={findAttribute(attributes, attribute.attributeId)?.title}
								InputProps={{
									readOnly: true,
								}}
								variant="filled"
							/>
							<TextField
								onChange={(e) =>
									attribute.attributeId &&
									handleOldAttrChange(attribute.attributeId, e.target.value)
								}
								defaultValue={attribute.attributeValue}
								fullWidth
								label="Значення"
							/>
						</section>
					))}

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
					<section>
						<b>Популярний товар</b>
						<Checkbox
							{...register("isPopular")}
							inputProps={{ "aria-label": "Checkbox demo" }}
						/>
					</section>
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

export default UpdateProductPage;
