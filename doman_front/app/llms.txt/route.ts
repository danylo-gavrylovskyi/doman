import { SITE } from "@/config/seo.config";

import { CategoriesService } from "@/services/categories.service";

export const revalidate = 3600;

export async function GET() {
	const categories = await CategoriesService.getAll().catch(() => []);

	const categoryLines = categories
		.map((category) => `- [${category.title}](${SITE.url}/categories/${category.slug})`)
		.join("\n");

	const body = `# ${SITE.name}

> ${SITE.description}

Мова сайту: українська. Валюта: гривня (UAH).

## Основні сторінки
- [Головна](${SITE.url})
- [Про компанію](${SITE.url}/about-company)
- [Оплата і доставка](${SITE.url}/payment-and-delivery)
- [Повернення та обмін](${SITE.url}/returns-and-exchanges)

## Категорії товарів
${categoryLines || "- (список категорій тимчасово недоступний)"}

## Мапа сайту
- [sitemap.xml](${SITE.url}/sitemap.xml)
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
