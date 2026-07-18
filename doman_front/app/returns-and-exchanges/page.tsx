import React from "react";

import { SITE } from "@/config/seo.config";

import { ReturnsAndExchangesContent } from "./ReturnsAndExchangesContent";

import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Повернення та обмін",
	description: `Умови повернення та обміну товарів в інтернет-магазині ${SITE.name}.`,
	alternates: { canonical: "/returns-and-exchanges" },
	openGraph: {
		title: `Повернення та обмін | ${SITE.name}`,
		url: `${SITE.url}/returns-and-exchanges`,
	},
};

export default function ReturnsAndExchangesPage() {
	return <ReturnsAndExchangesContent />;
}
