import { MetadataRoute } from "next";

import { SITE } from "@/config/seo.config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE.name,
		short_name: SITE.name,
		description: SITE.description,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: SITE.themeColor,
		lang: "uk",
		icons: [
			// Must match the real asset dimensions, otherwise browsers reject the icon.
			{ src: "/logo.png", sizes: "260x85", type: "image/png" },
		],
	};
}
