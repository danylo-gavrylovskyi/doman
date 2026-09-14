import React from "react";

import { SITE, absoluteUrl } from "@/config/seo.config";

import { BannersService } from "@/services/banners.service";
import { CategoriesService } from "@/services/categories.service";
import { ProductsService } from "@/services/products.service";

import { JsonLd } from "@/components/JsonLd";


import { AutoplaySlider } from "../modules/AutoplaySlider/AutoplaySlider";
import { Categories } from "../modules/Categories/Categories";
import { PopularItems } from "../modules/PopularItems/PopularItems";

import styles from "./page.module.scss";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: { absolute: SITE.title },
	description: SITE.description,
	alternates: { canonical: "/" },
	openGraph: {
		url: SITE.url,
		title: SITE.title,
		description: SITE.description,
	},
};

// ISR: refresh home (banners/categories) in the background without a redeploy.
export const revalidate = 300;

const Home = async () => {
	const [categories, banners, popularProducts] = await Promise.all([
		CategoriesService.getAll().catch(() => []),
		BannersService.getAll().catch(() => []),
		ProductsService.getPopular().catch(() => []),
	]);

	const itemListJsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: categories.map((category, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: category.title,
			url: absoluteUrl(`/categories/${category.slug}`),
		})),
	};

	return (
		<div>
			{categories.length > 0 && <JsonLd data={itemListJsonLd} />}
			<div className={styles.container}>
				<AutoplaySlider banners={banners} />
				<PopularItems products={popularProducts} />
				<Categories categories={categories} />
			</div>
		</div>
	);
};

export default Home;
