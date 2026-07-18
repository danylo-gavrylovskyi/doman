import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { SITE, absoluteUrl, uploadUrl } from "@/config/seo.config";

import { SubcategoriesService } from "@/services/subcategories.service";

import { JsonLd } from "@/components/JsonLd";

import { Subcategory } from "@/types/category.interface";


import styles from "../../categories/[category]/CategoryPage.module.scss";

import { SubcategoryListing } from "./SubcategoryListing";

import type { Metadata } from "next";

// ISR: cache the rendered page and refresh in the background.
export const revalidate = 300;

interface SubcategoryPageProps {
	params: { subcategory: string };
}

const getSubcategory = async (slug: string): Promise<Subcategory | null> => {
	try {
		return await SubcategoriesService.getBySlug(slug);
	} catch {
		return null;
	}
};

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
	const subcategory = await getSubcategory(params.subcategory);

	if (!subcategory) {
		return { title: "Підкатегорію не знайдено", robots: { index: false, follow: false } };
	}

	const description = `${subcategory.title} — купуйте в інтернет-магазині ${SITE.name}. Широкий вибір товарів, доступні ціни та доставка по Україні.`;
	const image = uploadUrl("subcategoriesImages", subcategory.image);
	const canonical = `/subcategories/${subcategory.slug}`;

	return {
		title: subcategory.title,
		description,
		alternates: { canonical },
		openGraph: {
			title: subcategory.title,
			description,
			url: absoluteUrl(canonical),
			images: image ? [{ url: image, alt: subcategory.title }] : undefined,
		},
	};
}

export async function generateStaticParams() {
	try {
		const subcategories = await SubcategoriesService.getAll();
		return subcategories.map((subcategory) => ({ subcategory: subcategory.slug }));
	} catch {
		return [];
	}
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
	const subcategory = await getSubcategory(params.subcategory);

	if (!subcategory) {
		notFound();
	}

	const image = uploadUrl("subcategoriesImages", subcategory.image);
	const canonical = absoluteUrl(`/subcategories/${subcategory.slug}`);

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Головна", item: SITE.url },
			...(subcategory.category
				? [
						{
							"@type": "ListItem",
							position: 2,
							name: subcategory.category.title,
							item: absoluteUrl(`/categories/${subcategory.category.slug}`),
						},
				  ]
				: []),
			{
				"@type": "ListItem",
				position: subcategory.category ? 3 : 2,
				name: subcategory.title,
				item: canonical,
			},
		],
	};

	const collectionJsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: subcategory.title,
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
						alt={subcategory.title}
						src={image}
						width={50}
						height={50}
						sizes="(max-width: 690px) 10vw, 50px"
						style={{ width: "auto", height: "auto", maxWidth: "10%" }}
					/>
				)}
				{subcategory.title}
			</h1>

			<SubcategoryListing subcategoryId={subcategory.id} />
		</div>
	);
}
