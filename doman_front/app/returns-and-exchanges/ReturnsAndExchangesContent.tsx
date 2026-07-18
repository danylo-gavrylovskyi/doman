"use client";

import React from "react";

import { useGetCompanyDetails } from "@/hooks/company-details.hooks";

export const ReturnsAndExchangesContent = () => {
	const content = useGetCompanyDetails().data?.returns_and_exchanges_content;

	return <div style={{ height: "60vh" }}>{content}</div>;
};
