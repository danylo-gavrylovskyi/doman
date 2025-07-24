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

import { Category } from "@/types/category.interface";
import { Product } from "@/types/product.interface";

import { Auth } from "../Auth/Auth";
import { HeaderProducts } from "./HeaderProducts/HeaderProducts";
import { MobileSearch } from "../MobileSearch/MobileSearch";
import { DropdownCategory } from "@/components/DropdownCategory/DropdownCategory";

import styles from "./Header.module.scss";

export const Header: React.FC<{ products: Product[] }> = ({ products }) => {
	const dispatch = useDispatch();

	const [inputValue, setInputValue] = React.useState<string>("");
	const [isAuthClicked, toggleAuth] = React.useState<boolean>(false);

	const foundProducts = products
		.filter((product) => product.title.toLowerCase().includes(inputValue.toLowerCase()))
		.slice(0, 4);

	const isCategoriesClicked: boolean = useSelector(
		(state: RootState) => state.home.isCategoriesClicked
	);
	const categories: Category[] = useSelector(
		(state: RootState) => state.adminCategories.categories
	);
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);

	const { push } = useRouter();

	return (
		<header className={styles.header}>
			<MobileSearch />
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
						{categories.map((category: Category) => (
							<DropdownCategory key={category.id} {...category} />
						))}
					</Paper>
				</section>
				<div className={styles.search}>
					<input
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Я шукаю..."></input>
					<svg
						fill="rgb(34, 34, 34);"
						width="20px"
						height="20px"
						viewBox="0 0 1920 1920"
						xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<path
								d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
								fillRule="evenodd"></path>
						</g>
					</svg>
				</div>

				{inputValue && <HeaderProducts products={foundProducts} />}

				<section className={`${styles.centerFlex} ${styles.userBtns}`}>
					<svg
						onClick={() => dispatch(setIsSearchOpened())}
						className={styles.mobileSearch}
						width="25px"
						height="25px"
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
