"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import {
	nextBanner,
	previousBanner,
	setCurrentBanner,
} from "@/redux/features/admin/adminGeneralSlice";

import styles from "./AutoplaySlider.module.scss";

export const AutoplaySlider = ({ banners }: { banners: string[] }) => {
	const dispatch = useDispatch();

	React.useEffect(() => {
		const autoplaySlider = setInterval(() => dispatch(nextBanner(banners.length)), 6000);
		return () => clearInterval(autoplaySlider);
	}, []);

	const currentBanner: number = useSelector(
		(state: RootState) => state.adminGeneral.currentBanner
	);

	return (
		<div className={styles.sliderImgContainer}>
			<img
				width={"100%"}
				alt="banner"
				src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${banners[currentBanner]}`}></img>
			<svg
				onClick={() => dispatch(previousBanner())}
				className={styles.leftArrow}
				xmlns="http://www.w3.org/2000/svg"
				width="5%"
				viewBox="0 0 24 24"
				fill="none">
				<path
					opacity="0.15"
					d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					fill="#000000"
				/>
				<path
					d="M14 7L9 12L14 17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="#000000"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<svg
				onClick={() => dispatch(nextBanner(banners.length))}
				className={styles.rightArrow}
				xmlns="http://www.w3.org/2000/svg"
				width="5%"
				viewBox="0 0 24 24"
				fill="none">
				<path
					opacity="0.15"
					d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					fill="#000000"
				/>
				<path
					d="M10 17L15 12L10 7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="#000000"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div className={styles.controls}>
				{banners.map((banner: string, index: number) => (
					<button
						key={banner}
						onClick={() => dispatch(setCurrentBanner(index))}
						style={
							index === currentBanner ? { backgroundColor: "rgb(34,34,34)" } : {}
						}></button>
				))}
			</div>
		</div>
	);
};
