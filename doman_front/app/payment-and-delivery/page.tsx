import React from "react";

import { SITE } from "@/config/seo.config";

import { PaymentAndDeliveryContent } from "./PaymentAndDeliveryContent";

import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Оплата і доставка",
	description: `Умови оплати та доставки замовлень в інтернет-магазині ${SITE.name}. Зручні способи оплати та доставка по всій Україні.`,
	alternates: { canonical: "/payment-and-delivery" },
	openGraph: {
		title: `Оплата і доставка | ${SITE.name}`,
		url: `${SITE.url}/payment-and-delivery`,
	},
};

export default function PaymentAndDeliveryPage() {
	return <PaymentAndDeliveryContent />;
}
