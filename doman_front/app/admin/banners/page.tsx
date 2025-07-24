"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { useAddBanner, useDeleteBanner, useGetBannersWithPagination } from "@/hooks/banners.hooks";

import { AdminBanner } from "@/components/Admin/AdminBanner/AdminBanner";
import { AdminPageLayout } from "@/modules/Admin/AdminPageLayout/AdminPageLayout";

const Banners = () => {
	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const [isAddingBanner, changeAddingMode] = React.useState<boolean>(false);

	const { data: banners } = useGetBannersWithPagination({ page, perPage });

	const { mutate: addBanner } = useAddBanner();
	const { mutate: deleteBanner } = useDeleteBanner();

	const onSaveBanner = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const fileInput = (event.target as HTMLFormElement).elements.namedItem(
			"image"
		) as HTMLInputElement;

		const image = fileInput?.files ? fileInput.files[0] : null;

		if (image) {
			addBanner(image);
		}
		changeAddingMode((prev) => !prev);
	};

	if (!banners) {
		return <div>Loading...</div>;
	}

	return (
		<AdminPageLayout
			isAdding={isAddingBanner}
			onSaveForm={onSaveBanner}
			changeAddingMode={changeAddingMode}
			createBtnText="Додати новий банер"
			insertImgText="Завантажити банер"
			page={page}
			perPage={perPage}
			elementsCount={banners.count}>
			<>
				{banners.rows.map((banner: string) => (
					<AdminBanner key={banner} deleteBanner={deleteBanner} bannerUrl={banner} />
				))}
			</>
		</AdminPageLayout>
	);
};

export default Banners;
