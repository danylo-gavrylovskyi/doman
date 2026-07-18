import React from "react";

import { SITE } from "@/config/seo.config";

import { AboutCompanyContent } from "./AboutCompanyContent";

import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Про компанію",
	description: `Дізнайтеся більше про компанію ${SITE.name} — наш асортимент, цінності та переваги.`,
	alternates: { canonical: "/about-company" },
	openGraph: {
		title: `Про компанію | ${SITE.name}`,
		url: `${SITE.url}/about-company`,
	},
};

export default function AboutCompanyPage() {
	return <AboutCompanyContent />;
}
