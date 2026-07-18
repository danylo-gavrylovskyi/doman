import { Injectable, Logger } from "@nestjs/common";

type RevalidateTarget = {
	path: string;
	type?: "page" | "layout";
};

/**
 * Notifies the Next.js frontend to on-demand revalidate ISR pages after a
 * content mutation. Fire-and-forget: a failed revalidation must never break the
 * originating mutation, so every error is caught and logged.
 */
@Injectable()
export class RevalidationService {
	constructor(private readonly logger: Logger) { }

	async revalidate(targets: RevalidateTarget[]): Promise<void> {
		const frontendUrl = process.env.FRONTEND_URL;
		const secret = process.env.REVALIDATE_SECRET;

		if (!frontendUrl || !secret) {
			this.logger.warn(
				"Skipping revalidation: FRONTEND_URL or REVALIDATE_SECRET is not set",
				RevalidationService.name
			);
			return;
		}

		try {
			const response = await fetch(`${frontendUrl}/api/revalidate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-revalidate-secret": secret,
				},
				body: JSON.stringify({ paths: targets }),
			});

			if (!response.ok) {
				this.logger.warn(
					`Revalidation request returned status ${response.status}`,
					RevalidationService.name
				);
				return;
			}

			this.logger.log(
				`Revalidated paths: ${targets.map((target) => target.path).join(", ")}`,
				RevalidationService.name
			);
		} catch (error) {
			this.logger.warn(
				`Revalidation request failed: ${error.message}`,
				RevalidationService.name
			);
		}
	}

	revalidateProducts(): Promise<void> {
		return this.revalidate([
			{ path: "/products/[product]", type: "page" },
			{ path: "/categories/[category]", type: "page" },
			{ path: "/subcategories/[subcategory]", type: "page" },
			{ path: "/" },
			{ path: "/sitemap.xml" },
		]);
	}

	revalidateCategories(): Promise<void> {
		return this.revalidate([
			{ path: "/categories/[category]", type: "page" },
			{ path: "/" },
			{ path: "/sitemap.xml" },
		]);
	}

	revalidateSubcategories(): Promise<void> {
		return this.revalidate([
			{ path: "/subcategories/[subcategory]", type: "page" },
			{ path: "/categories/[category]", type: "page" },
			{ path: "/sitemap.xml" },
		]);
	}

	revalidateBanners(): Promise<void> {
		return this.revalidate([{ path: "/" }]);
	}
}
