import React from "react";

/**
 * Renders a JSON-LD structured data block. Safe to use in Server Components
 * so the markup is present in the initial HTML for crawlers.
 */
export const JsonLd = ({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) => (
	<script
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
	/>
);
