import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { SITE, absoluteUrl, uploadUrl } from "@/config/seo.config";

import { CategoriesService } from "@/services/categories.service";

import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { JsonLd } from "@/components/JsonLd";

import { Category } from "@/types/category.interface";


import { CategoryListing } from "./CategoryListing";
import styles from "./CategoryPage.module.scss";

import type { Metadata } from "next";

// ISR: cache the rendered page and refresh in the background.
export const revalidate = 300;

interface CategoryPageProps {
	params: { category: string };
}

const getCategory = async (slug: string): Promise<Category | null> => {
	try {
		return await CategoriesService.getBySlug(slug);
	} catch {
		return null;
	}
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
	const category = await getCategory(params.category);

	if (!category) {
		return { title: "Категорію не знайдено", robots: { index: false, follow: false } };
	}

	const description = `${category.title} — купуйте в інтернет-магазині ${SITE.name}. Широкий вибір товарів, доступні ціни та доставка по Україні.`;
	const image = uploadUrl("categoriesImages", category.image);
	const canonical = `/categories/${category.slug}`;

	return {
		title: category.title,
		description,
		alternates: { canonical },
		openGraph: {
			title: category.title,
			description,
			url: absoluteUrl(canonical),
			images: image ? [{ url: image, alt: category.title }] : undefined,
		},
	};
}

export async function generateStaticParams() {
	try {
		const categories = await CategoriesService.getAll();
		return categories.map((category) => ({ category: category.slug }));
	} catch {
		return [];
	}
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const category = await getCategory(params.category);

	if (!category) {
		notFound();
	}

	const image = uploadUrl("categoriesImages", category.image);
	const canonical = absoluteUrl(`/categories/${category.slug}`);

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Головна", item: SITE.url },
			{ "@type": "ListItem", position: 2, name: category.title, item: canonical },
		],
	};

	const collectionJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: category.title,
		url: canonical,
		inLanguage: "uk-UA",
	};

	return (
		<div className={styles.container}>
			<JsonLd data={breadcrumbJsonLd} />
			<JsonLd data={collectionJsonLd} />

			<h1 className={styles.title}>
				{image && (
					<Image
						alt={category.title}
						src={image}
						width={50}
						height={50}
						sizes="(max-width: 690px) 10vw, 50px"
						style={{ width: "auto", height: "auto", maxWidth: "10%" }}
					/>
				)}
				{category.title}
			</h1>

			{category.subcategories && category.subcategories.length > 0 && (
				<div className={styles.subcategories}>
					{category.subcategories.map((subcategory) => (
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
			)}

			<CategoryListing categoryId={category.id} />
		</div>
	);
}
