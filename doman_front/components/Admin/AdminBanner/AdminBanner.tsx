import { Button, Paper } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

import styles from "./AdminBanner.module.scss";

interface AdminBannerProps {
	bannerUrl: string;
	deleteBanner: UseMutateFunction<string, unknown, string, unknown>;
}

export const AdminBanner = ({ bannerUrl, deleteBanner }: AdminBannerProps) => {
	return (
		<Paper elevation={3} className={styles.container}>
			<Image
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${bannerUrl}`}
				alt="Banner"
				width={800}
				height={200}
				sizes="(max-width: 768px) 100vw, 80vw"
				style={{
					width: '80%',
					height: 'auto',
				}}
			/>
			<Button onClick={() => deleteBanner(bannerUrl)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
