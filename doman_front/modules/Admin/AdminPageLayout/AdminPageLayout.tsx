import React, { ChangeEventHandler } from "react";
import { MenuItem, TextField } from "@mui/material";

import { Pagination } from "@/components/Pagination/Pagination";
import { PerPageSelector } from "@/components/PerPageSelector/PerPageSelector";
import { Search } from "@/components/Search/Search";

import { Category } from "@/types/category.interface";

import styles from "./AdminPageLayout.module.scss";

interface AdminPageProps {
	isAdding: boolean;
	onSaveForm: (event: React.FormEvent<HTMLFormElement>) => void;
	changeAddingMode: (value: React.SetStateAction<boolean>) => void;
	isImageInputNeeded?: boolean;
	isInputNeeded?: boolean;
	isSelectNeeded?: boolean;
	categories?: Category[];
	children: React.ReactNode;
	createBtnText: string;
	inputText?: string;
	insertImgText?: string;
	page: number;
	perPage: number;
	elementsCount: number;
	inputValue: string;
	setInputValue: ChangeEventHandler<HTMLInputElement>;
}

export const AdminPageLayout = ({
	isAdding,
	onSaveForm,
	changeAddingMode,
	isImageInputNeeded = true,
	isInputNeeded = false,
	isSelectNeeded = false,
	categories = [],
	children,
	createBtnText,
	inputText,
	insertImgText,
	page,
	perPage,
	elementsCount,
	inputValue,
	setInputValue
}: AdminPageProps) => {
	return (
		<>
			<header className={styles.header}>
				<form onSubmit={onSaveForm} aria-label="admin form">
					<button
						type="button"
						style={isAdding ? { display: "none" } : { display: "block" }}
						onClick={() => changeAddingMode((prev) => !prev)}>
						{createBtnText}
					</button>

					<div style={isAdding ? { display: "none" } : { display: "block" }}>
						<PerPageSelector perPage={perPage} />
					</div>

					<div style={isAdding ? { display: "none" } : { display: "block" }}>
						<Search inputValue={inputValue} onChangeInput={setInputValue} />
					</div>

					<button type="submit" style={isAdding ? { display: "block" } : { display: "none" }}>
						Зберегти
					</button>
					<div
						style={isAdding ? { display: "flex" } : { display: "none" }}
						className={styles.creating}>
						{isInputNeeded && <input className={styles.input} name="title" placeholder={inputText}></input>}
						{isSelectNeeded && (
							<TextField
								name="categoryId"
								InputProps={{ style: { color: "white" } }}
								className={styles.select}
								select
								label="Категорія"
								focused>
								{categories.map((category: Category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.title}
									</MenuItem>
								))}
							</TextField>
						)}
						{isImageInputNeeded && (
							<label className={styles.loadImg} htmlFor="categoryImg">
								{insertImgText}
							</label>
						)}
						<input className={styles.input} name="image" id="categoryImg" type="file"></input>
					</div>
				</form>
			</header>
			<main className={styles.main}>{children}</main>
			<footer className={styles.footer}>
				<Pagination
					pageQuantity={elementsCount / +perPage < 1 ? 1 : Math.ceil(elementsCount / +perPage)}
					currentPage={page ? +page : 1}
				/>
			</footer>
		</>
	);
};
