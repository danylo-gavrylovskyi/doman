import { MetadataRoute } from "next";

import { SITE } from "@/config/seo.config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/profile", "/checkout"],
			},
		],
		sitemap: `${SITE.url}/sitemap.xml`,
	};
}
