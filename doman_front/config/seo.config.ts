const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const SITE = {
	name: "Doman",
	/**
	 * Public production URL of the storefront. MUST be set in production
	 * (NEXT_PUBLIC_SITE_URL) — it is used for canonical URLs, the sitemap,
	 * robots.txt and Open Graph tags. Falls back to localhost for dev.
	 */
	url: stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
	locale: "uk_UA",
	themeColor: "#17aaf3",
	title: "Doman — опалення, сантехніка та комплектуючі",
	description:
		"Doman — інтернет-магазин опалювального обладнання та сантехніки: котли, радіатори, змішувачі та комплектуючі. Широкий асортимент, доступні ціни та доставка по всій Україні.",
} as const;

export const absoluteUrl = (path = "") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Builds an absolute URL to an uploaded image served by the backend. */
export const uploadUrl = (folder: string, filename?: string | null) => {
	if (!filename) return undefined;
	return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${folder}/${filename}`;
};
