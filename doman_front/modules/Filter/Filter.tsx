"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { toggleFilter } from "@/redux/features/filterSlice";

import { UniqueAttribute } from "@/types/unique-attribute.interface";
import { Attribute } from "@/types/attribute.interface";

import { findAttribute } from "@/utils/findAttribute";

import { FilterBlock } from "@/components/FilterBlock/FilterBlock";

import styles from "./Filter.module.scss";

interface FilterProps {
	uniqueAttributes: UniqueAttribute[];
	attributes: Attribute[];
}

export const Filter = ({ uniqueAttributes, attributes }: FilterProps) => {
	const dispatch = useDispatch();
	const isOpened: boolean = useSelector((state: RootState) => state.filter.isOpened);

	return (
		<>
			<div
				onClick={() => dispatch(toggleFilter())}
				className={`${styles.darkBg} ${isOpened ? styles.visible : styles.hidden}`}></div>
			<div className={`${styles.container} ${isOpened ? styles.open : styles.close}`}>
				<header className={styles.header}>
					<div className={styles.headerTitle}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="25%"
							viewBox="0 0 64 64"
							strokeWidth="3"
							stroke="#ffffff"
							fill="none">
							<line x1="50.69" y1="32" x2="56.32" y2="32" />
							<line x1="7.68" y1="32" x2="38.69" y2="32" />
							<line x1="26.54" y1="15.97" x2="56.32" y2="15.97" />
							<line x1="7.68" y1="15.97" x2="14.56" y2="15.97" />
							<line x1="35" y1="48.03" x2="56.32" y2="48.03" />
							<line x1="7.68" y1="48.03" x2="23" y2="48.03" />
							<circle cx="20.55" cy="15.66" r="6" />
							<circle cx="44.69" cy="32" r="6" />
							<circle cx="29" cy="48.03" r="6" />
						</svg>
						<span>Фільтр</span>
					</div>
					<svg
						style={{ marginRight: "2%" }}
						onClick={() => dispatch(toggleFilter())}
						xmlns="http://www.w3.org/2000/svg"
						width="8%"
						viewBox="0 0 24 24"
						fill="none">
						<path
							d="M19 5L5 19M5.00001 5L19 19"
							stroke="#ffffff"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</header>
				<div className={styles.filters}>
					{uniqueAttributes.map((uniqueAttribute) => (
						<aside key={uniqueAttribute.attrId}>
							<FilterBlock
								attributeName={
									findAttribute(attributes, uniqueAttribute.attrId) &&
									findAttribute(attributes, uniqueAttribute.attrId).title
								}
								attributeValues={uniqueAttribute.values}
							/>
						</aside>
					))}
				</div>
			</div>
		</>
	);
};
