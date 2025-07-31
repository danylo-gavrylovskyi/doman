"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { toggleFilter } from "@/redux/features/filterSlice";

import { useGetCategoryBySlug, useGetCategoryFilterAttributes } from "@/hooks/categories.hooks";
import { useGetProductsWithPagination } from "@/hooks/products.hooks";

import { Subcategory } from "@/types/category.interface";

import { SkeletonPage } from "@/modules/SkeletonPage/SkeletonPage";
import { Filter } from "@/modules/Filter/Filter";

import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { FilterBlock } from "@/components/FilterBlock/FilterBlock";
import { Item } from "@/components/Item/Item";
import { Pagination } from "@/components/Pagination/Pagination";

import styles from "./CategoryPage.module.scss";
import { PAGINATION_FALLBACK_PAGE, PAGINATION_FALLBACK_PER_PAGE } from "@/types/constants/paginationFallbackValues";
import { sanitizePagination } from "@/utils/sanitizePagination";

const page = () => {
	const dispatch = useDispatch();
	const checkedAttributes = useSelector((state: RootState) => state.filter.checkedAttributes);

	const categorySlug: string = useParams().category as string;
	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: category } = useGetCategoryBySlug(categorySlug);
	const subcategories = category?.subcategories;

	const { data: products } = useGetProductsWithPagination({
		page,
		perPage,
		categoryId: category?.id,
		filterParams: checkedAttributes
	}, { enabled: !!category?.id });

	const { data: filterAttributes } = useGetCategoryFilterAttributes(category?.id);

	if (!category || !subcategories || !products || !filterAttributes) {
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
			<Filter attributesWithValues={filterAttributes} />
			<div className={styles.filterProd}>
				<aside className={styles.filter}>
					{filterAttributes.map((attributeWithValues) => (
						<FilterBlock
							key={attributeWithValues.title}
							attributeName={attributeWithValues.title}
							attributeValues={attributeWithValues.values}
						/>
					))}
				</aside>
				<main className={styles.products}>
					{products.rows.map((product) => (
						<Item key={product.id} {...product} />
					))}
				</main>
			</div>
			<footer>
				<Pagination
					pageQuantity={
						perPage
							? products.count / +perPage < 1
								? 1
								: Math.round(products.count / +perPage)
							: 1
					}
					currentPage={page ? +page : 1}
				/>
			</footer>
		</div>
	);
};

export default page;
