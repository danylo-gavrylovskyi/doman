"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { AdminBanner } from "@/components/Admin/AdminBanner/AdminBanner";
import { AdminHeader } from "@/components/Admin/AdminHeader/AdminHeader";
import { Pagination } from "@/components/Pagination/Pagination";

import { useDeleteBanner, useGetBannersWithPagination } from "@/hooks/banners.hooks";

import { sanitizePagination } from "@/utils/sanitizePagination";

import { ADMIN_PAGINATION_FALLBACK_PER_PAGE, PAGINATION_FALLBACK_PAGE } from "@/types/constants/paginationFallbackValues";

import styles from "./admin-banners.module.scss"

const Banners = () => {
	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), ADMIN_PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

	const { data: banners } = useGetBannersWithPagination({ page, perPage });

	const { mutate: deleteBanner } = useDeleteBanner();

	if (!banners) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<AdminHeader
				addBtnText="Додати новий банер"
				perPage={perPage}
				entityName="banners"
			/>

			<div className={styles.content}>
				{banners.rows.map((banner: string) => (
					<AdminBanner key={banner} deleteBanner={deleteBanner} bannerUrl={banner} />
				))}
			</div>

			<footer>
				<Pagination
					elementsCount={banners.count}
					perPage={perPage}
					currentPage={page}
				/>
			</footer>
		</>
	);
};

export default Banners;
