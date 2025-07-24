"use client";

import React from "react";

import { useGetCompanyDetails } from "@/hooks/company-details.hooks";

const page = () => {
	const content = useGetCompanyDetails().data?.about_company_content;

	return <div style={{ height: "60vh" }}>{content}</div>;
};

export default page;
