import React from "react";
import { Button, Paper } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";

import styles from "./AdminBanner.module.scss";

interface AdminBannerProps {
	bannerUrl: string;
	deleteBanner: UseMutateFunction<string, unknown, string, unknown>;
}

export const AdminBanner = ({ bannerUrl, deleteBanner }: AdminBannerProps) => {
	return (
		<Paper elevation={3} className={styles.container}>
			<img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${bannerUrl}`}></img>
			<Button onClick={() => deleteBanner(bannerUrl)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
