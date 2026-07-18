import { Paper } from "@mui/material";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { SITE, absoluteUrl, uploadUrl } from "@/config/seo.config";

import { ProductsService } from "@/services/products.service";

import { JsonLd } from "@/components/JsonLd";

import { Product } from "@/types/product.interface";


import { AddToCartButton } from "./AddToCartButton";
import styles from "./ProductPage.module.scss";

import type { Metadata } from "next";

// ISR: cache the rendered page and refresh price/stock in the background.
export const revalidate = 120;

interface ProductPageProps {
	params: { product: string };
}

const truncate = (text: string, max = 160) => {
	if (!text) return "";
	const clean = text.replace(/\s+/g, " ").trim();
	return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

const getProduct = async (slug: string): Promise<Product | null> => {
	try {
		return await ProductsService.getBySlug(slug);
	} catch {
		return null;
	}
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
	const product = await getProduct(params.product);

	if (!product) {
		return { title: "Товар не знайдено", robots: { index: false, follow: false } };
	}

	const description =
		truncate(product.description) ||
		`${product.title} — купити в інтернет-магазині ${SITE.name}. Ціна ${product.price} грн.`;
	const image = uploadUrl("productsImages", product.image);
	const canonical = `/products/${product.slug}`;

	return {
		title: product.title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: product.title,
			description,
			url: absoluteUrl(canonical),
			images: image ? [{ url: image, alt: product.title }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: product.title,
			description,
			images: image ? [image] : undefined,
		},
	};
}

export async function generateStaticParams() {
	try {
		const { rows } = await ProductsService.getAllWithPagination({ page: 1, perPage: 100000 });
		return rows.filter((product) => product.slug).map((product) => ({ product: product.slug }));
	} catch {
		return [];
	}
}

export default async function ProductPage({ params }: ProductPageProps) {
	const product = await getProduct(params.product);

	if (!product) {
		notFound();
	}

	const image = uploadUrl("productsImages", product.image);
	const canonical = absoluteUrl(`/products/${product.slug}`);
	const inStock = product.quantity > 0;

	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.title,
		description: truncate(product.description, 500) || product.title,
		image: image ? [image] : undefined,
		sku: product.article || String(product.id),
		...(product.subcategory?.title ? { category: product.subcategory.title } : {}),
		offers: {
			"@type": "Offer",
			url: canonical,
			priceCurrency: "UAH",
			price: product.price,
			availability: inStock
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
		},
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Головна", item: SITE.url },
			...(product.subcategory
				? [
						{
							"@type": "ListItem",
							position: 2,
							name: product.subcategory.title,
							item: absoluteUrl(`/subcategories/${product.subcategory.slug}`),
						},
				  ]
				: []),
			{
				"@type": "ListItem",
				position: product.subcategory ? 3 : 2,
				name: product.title,
				item: canonical,
			},
		],
	};

	return (
		<div className={styles.container}>
			<JsonLd data={productJsonLd} />
			<JsonLd data={breadcrumbJsonLd} />

			<div className={styles.wrapper}>
				<Paper elevation={16} className={styles.paper}>
					{image && (
						<Image
							src={image}
							alt={product.title}
							width={500}
							height={400}
							sizes="(max-width: 768px) 100vw, 500px"
							priority
							style={{
								width: "100%",
								height: "auto",
								maxHeight: "400px",
								objectFit: "contain",
								borderRadius: "10px",
							}}
						/>
					)}
				</Paper>

				<div className={styles.details}>
					<h1 className={styles.title}>{product.title}</h1>
					<p className={styles.price}>{product.price} грн.</p>
					<p className={`${styles.stock} ${!inStock ? styles.out : ""}`}>
						{inStock ? `В наявності: ${product.quantity} шт.` : "Немає в наявності"}
					</p>
					<p className={styles.descr}>{product.description}</p>

					<AddToCartButton product={product} />

					<div className={styles.extraDetails}>
						<h2>Характеристики</h2>
						<ul>
							{product.attributes?.map((productAttr) => (
								<li key={productAttr.id}>
									<strong>{productAttr.attribute?.title}:</strong> {productAttr.attributeValue}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
