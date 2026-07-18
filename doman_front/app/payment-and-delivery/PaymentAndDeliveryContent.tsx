"use client";

import React from "react";

import { useGetCompanyDetails } from "@/hooks/company-details.hooks";

export const PaymentAndDeliveryContent = () => {
	const content = useGetCompanyDetails().data?.payment_and_delivery_content;

	return <div style={{ height: "60vh" }}>{content}</div>;
};
