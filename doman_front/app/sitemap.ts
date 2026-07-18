import { MetadataRoute } from "next";

import { SITE } from "@/config/seo.config";

import { CategoriesService } from "@/services/categories.service";
import { ProductsService } from "@/services/products.service";
import { SubcategoriesService } from "@/services/subcategories.service";

// Regenerate the sitemap at most once per hour.
export const revalidate = 3600;

// Google ignores <changefreq> and <priority>, so we only emit <loc>.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticEntries: MetadataRoute.Sitemap = [
		{ url: SITE.url },
		{ url: `${SITE.url}/about-company` },
		{ url: `${SITE.url}/payment-and-delivery` },
		{ url: `${SITE.url}/returns-and-exchanges` },
	];

	// Never let a failed API call break the build — fall back to static routes.
	const [categories, subcategories, products] = await Promise.all([
		CategoriesService.getAll().catch(() => []),
		SubcategoriesService.getAll().catch(() => []),
		ProductsService.getAllWithPagination({ page: 1, perPage: 100000 })
			.then((res) => res.rows)
			.catch(() => []),
	]);

	const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
		url: `${SITE.url}/categories/${category.slug}`,
	}));

	const subcategoryEntries: MetadataRoute.Sitemap = subcategories.map((subcategory) => ({
		url: `${SITE.url}/subcategories/${subcategory.slug}`,
	}));

	const productEntries: MetadataRoute.Sitemap = products
		.filter((product) => product.slug)
		.map((product) => ({
			url: `${SITE.url}/products/${product.slug}`,
		}));

	return [...staticEntries, ...categoryEntries, ...subcategoryEntries, ...productEntries];
}
