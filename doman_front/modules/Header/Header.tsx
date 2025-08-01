"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";

import { changeCartStatus } from "../../redux/features/cartSlice";
import { setIsCategClicked } from "@/redux/features/homeSlice";
import { setIsSearchOpened, toggleHamburgerMenu } from "@/redux/features/headerSlice";
import { RootState } from "@/redux/store";

import { useGetProductsWithPagination } from "@/hooks/products.hooks";

import { Category } from "@/types/category.interface";
import { Product } from "@/types/product.interface";

import { Auth } from "@/modules/Auth/Auth";
import { HeaderProducts } from "@/modules/Header/HeaderProducts/HeaderProducts";
import { MobileSearch } from "@/modules/MobileSearch/MobileSearch";

import { DropdownCategory } from "@/components/DropdownCategory/DropdownCategory";
import { Search } from "@/components/Search/Search";

import styles from "./Header.module.scss";

export const Header: React.FC = () => {
	const dispatch = useDispatch();

	const [inputValue, setInputValue] = React.useState<string>("");
	const [isAuthClicked, toggleAuth] = React.useState<boolean>(false);

	const { data } = useGetProductsWithPagination({ inputValue });
	const products: Product[] = data?.rows ?? [];

	const isCategoriesClicked: boolean = useSelector(
		(state: RootState) => state.home.isCategoriesClicked
	);
	const categories: Category[] = useSelector(
		(state: RootState) => state.adminCategories.categories
	);
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);

	const { push } = useRouter();

	const clearInput = () => setInputValue("");

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<svg
					onClick={() => dispatch(toggleHamburgerMenu())}
					className={styles.hamburgerMenu}
					fill="#fff"
					width="25px"
					height="25px"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z" />
				</svg>
				<Link href="/" className={styles.link}>
					<img width={"100%"} alt="logo" src="/logo.png"></img>
				</Link>
				<section
					onClick={() => dispatch(setIsCategClicked())}
					className={`${styles.centerFlex} ${styles.categoryBtn}`}>
					<span>Категорії</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25px"
						height="25px"
						viewBox="0 0 24 24"
						fill="none">
						<path
							d="M7 10L12 15L17 10"
							stroke="#fff"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					<Paper
						elevation={3}
						style={!isCategoriesClicked ? { visibility: "hidden", opacity: "0" } : {}}
						className={styles.categoriesDropdown}>
						{
							categories.length === 0 ?
								(
									<div>Категорій наразі немає</div>
								)
								:
								categories.map((category: Category) => (
									<DropdownCategory key={category.id} {...category} />
								))
						}
					</Paper>
				</section>

				<Search
					onChangeInput={(e) => setInputValue(e.target.value)}
					inputValue={inputValue}
					className={styles.search}
				/>
				<MobileSearch
					onChangeInput={(e) => setInputValue(e.target.value)}
					inputValue={inputValue}
					clearInput={clearInput}
				/>

				{inputValue && <HeaderProducts products={products} />}

				<section className={`${styles.centerFlex} ${styles.userBtns}`}>
					<svg
						onClick={() => dispatch(setIsSearchOpened())}
						className={styles.mobileSearch}
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
							stroke="#fff"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span
						onClick={() =>
							currentUser.email ? push("/profile/orders") : toggleAuth((prev) => !prev)
						}
						className={styles.profileBtn}>
						<svg
							className={styles.profileSvg}
							fill="#fff"
							width="25px"
							height="25px"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<path d="M12,11A5,5,0,1,0,7,6,5.006,5.006,0,0,0,12,11Zm0-8A3,3,0,1,1,9,6,3,3,0,0,1,12,3ZM3,22V18a5.006,5.006,0,0,1,5-5h8a5.006,5.006,0,0,1,5,5v4a1,1,0,0,1-2,0V18a3,3,0,0,0-3-3H8a3,3,0,0,0-3,3v4a1,1,0,0,1-2,0Z"></path>
							</g>
						</svg>
						<span className={styles.iconText}>Ваш профіль</span>
					</span>

					{isAuthClicked && <Auth toggleAuth={toggleAuth} />}

					<span onClick={() => dispatch(changeCartStatus())} className={styles.centerFlex}>
						<svg
							className={styles.cartSvg}
							width="25px"
							height="25px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<path
									d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 5.5H13.5M13.5 5.5H11M13.5 5.5V8M13.5 5.5V3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
									stroke="#fff"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"></path>
							</g>
						</svg>
						<span className={styles.iconText}>Корзина</span>
					</span>
				</section>
			</div>
		</header>
	);
};
