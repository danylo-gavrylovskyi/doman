"use client";

import React from "react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "@/redux/store";
import { toggleHamburgerMenu } from "@/redux/features/headerSlice";

import styles from "./HamburgerMenu.module.scss";
import { fetchCategories } from "@/redux/features/admin/adminCategoriesSlice";
import { CategoryCard } from "@/components/CategoryCard/CategoryCard";

export const HamburgerMenu = () => {
	const dispatch = useAppDispatch();
	const isOpened = useSelector((state: RootState) => state.header.isHamburgerMenuOpened);
	const categories = useSelector((state: RootState) => state.adminCategories.categories);

	React.useEffect(() => {
		dispatch(fetchCategories());
	}, []);
	return (
		<>
			<div
				onClick={() => dispatch(toggleHamburgerMenu())}
				className={`${styles.darkBg} ${isOpened ? styles.visible : styles.hidden}`}></div>
			<div className={`${styles.container} ${isOpened ? styles.open : styles.close}`}>
				<header className={styles.header}>
					<span>Каталог товарів</span>
				</header>
				<main>
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							slug={category.slug}
							title={category.title}
							image={category.image}
						/>
					))}
				</main>
			</div>
		</>
	);
};
