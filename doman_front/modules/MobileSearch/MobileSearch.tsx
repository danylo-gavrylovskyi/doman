import React, { ChangeEventHandler } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setIsSearchOpened } from "@/redux/features/headerSlice";
import { RootState } from "@/redux/store";

import styles from "./MobileSearch.module.scss";

export const MobileSearch = ({
	onChangeInput,
	inputValue,
	clearInput
}: {
	onChangeInput: ChangeEventHandler<HTMLInputElement>;
	inputValue: string;
	clearInput: () => void;
}) => {
	const dispatch = useDispatch();
	const isSearchOpened: boolean = useSelector((state: RootState) => state.header.isSearchOpened);

	const closeSearch = () => {
		clearInput();
		dispatch(setIsSearchOpened())
	}

	return (
		<>
			<div
				onClick={closeSearch}
				className={`${styles.darkBg} ${isSearchOpened ? styles.visible : styles.hidden}`}></div>
			<div className={`${styles.search} ${isSearchOpened ? styles.open : styles.close}`}>
				<svg
					onClick={closeSearch}
					xmlns="http://www.w3.org/2000/svg"
					width="30px"
					height="30px"
					viewBox="0 0 24 24"
					fill="none">
					<path
						d="M19 5L5 19M5.00001 5L19 19"
						stroke="#000000"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<input placeholder="Я шукаю..." onChange={onChangeInput} value={inputValue}></input>
			</div>
		</>
	);
};
