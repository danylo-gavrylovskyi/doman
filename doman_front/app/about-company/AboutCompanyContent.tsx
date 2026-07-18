"use client";

import React from "react";

import { useGetCompanyDetails } from "@/hooks/company-details.hooks";

export const AboutCompanyContent = () => {
	const content = useGetCompanyDetails().data?.about_company_content;

	return <div style={{ height: "60vh" }}>{content}</div>;
};
