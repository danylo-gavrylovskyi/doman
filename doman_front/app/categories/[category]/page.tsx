"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { toggleFilter } from "@/redux/features/filterSlice";

import { useGetCategories } from "@/hooks/categories.hooks";
import { useGetSubcategories } from "@/hooks/subcategories.hooks";
import { useGetAttributes } from "@/hooks/attributes.hooks";
import { useGetProductsWithPagination } from "@/hooks/products.hooks";

import { Category, Subcategory } from "@/types/category.interface";
import { PaginationProducts, Product } from "@/types/product.interface";
import { UniqueAttribute } from "@/types/unique-attribute.interface";

import { SkeletonPage } from "@/modules/SkeletonPage/SkeletonPage";
import { Filter } from "@/modules/Filter/Filter";

import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { FilterBlock } from "@/components/FilterBlock/FilterBlock";
import { Item } from "@/components/Item/Item";
import { Pagination } from "@/components/Pagination/Pagination";

import { findUniqueAttributesInCategory } from "@/utils/findUniqueAttributes";
import { findAttribute } from "@/utils/findAttribute";

import styles from "./CategoryPage.module.scss";

const page = () => {
	const dispatch = useDispatch();

	let categorySlug: string = useParams().category as string;

	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage");
	const page = queryParams.get("page");

	const category: Category | undefined = useGetCategories().data?.find(
		(category) => category.slug === categorySlug
	);

	const checkedAttributes = useSelector((state: RootState) => state.filter.checkedAttributes);

	const { data: subcategories } = useGetSubcategories();
	const { data: attributes } = useGetAttributes();
	const { data: products } = useGetProductsWithPagination();

	let foundProducts = products ? products : ({} as PaginationProducts);

	if (page && perPage) {
		foundProducts.rows = useGetProductsWithPagination({ page, perPage }).data?.rows.filter(
			(product: Product) => product.subcategory?.categoryId === category?.id
		) as Product[];
	} else {
		foundProducts.rows = useGetProductsWithPagination().data?.rows.filter(
			(product: Product) => product.subcategory?.categoryId === category?.id
		) as Product[];
	}

	if (!category || !attributes || !foundProducts || !subcategories || !products) {
		return <SkeletonPage />;
	}

	let uniqueAttributes: UniqueAttribute[] = findUniqueAttributesInCategory(
		category,
		subcategories,
		foundProducts.rows
	);

	if (checkedAttributes.length > 0) {
		foundProducts.rows = foundProducts.rows.filter((product) =>
			product.attributes?.some((attr) => checkedAttributes.includes(attr.attributeValue))
		) as Product[];
	}

	if (uniqueAttributes.length <= 0) {
		return <SkeletonPage />;
	}

	return (
		<div className={styles.container}>
			<p className={styles.title}>
				<img
					width={"5%"}
					alt="category"
					src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categoriesImages/${category.image}`}
				/>
				{category.title}
			</p>
			<div className={styles.subcategories}>
				{category.subcategories?.map((subcategory: Subcategory) => (
					<section className={styles.subcategoryCard} key={subcategory.id}>
						<CategoryCard
							imageFolder="subcategoriesImages"
							slug={subcategory.slug}
							image={subcategory.image}
							title={subcategory.title}
						/>
					</section>
				))}
			</div>
			<div className={styles.filterBtn}>
				<button onClick={() => dispatch(toggleFilter())}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25%"
						viewBox="0 0 64 64"
						strokeWidth="3"
						stroke="#ffffff"
						fill="none">
						<line x1="50.69" y1="32" x2="56.32" y2="32" />
						<line x1="7.68" y1="32" x2="38.69" y2="32" />
						<line x1="26.54" y1="15.97" x2="56.32" y2="15.97" />
						<line x1="7.68" y1="15.97" x2="14.56" y2="15.97" />
						<line x1="35" y1="48.03" x2="56.32" y2="48.03" />
						<line x1="7.68" y1="48.03" x2="23" y2="48.03" />
						<circle cx="20.55" cy="15.66" r="6" />
						<circle cx="44.69" cy="32" r="6" />
						<circle cx="29" cy="48.03" r="6" />
					</svg>
					Фільтр
				</button>
			</div>
			<Filter uniqueAttributes={uniqueAttributes} attributes={attributes} />
			<div className={styles.filterProd}>
				<aside className={styles.filter}>
					{uniqueAttributes.map((uniqueAttribute) => (
						<FilterBlock
							key={uniqueAttribute.attrId}
							attributeName={
								findAttribute(attributes, uniqueAttribute.attrId) &&
								findAttribute(attributes, uniqueAttribute.attrId).title
							}
							attributeValues={uniqueAttribute.values}
						/>
					))}
				</aside>
				<main className={styles.products}>
					{foundProducts.rows.map((product) => (
						<Item key={product.id} {...product} />
					))}
				</main>
			</div>
			<footer>
				<Pagination
					pageQuantity={
						perPage
							? foundProducts.count / +perPage < 1
								? 1
								: Math.round(foundProducts.count / +perPage)
							: 1
					}
					currentPage={page ? +page : 1}
				/>
			</footer>
		</div>
	);
};

export default page;
