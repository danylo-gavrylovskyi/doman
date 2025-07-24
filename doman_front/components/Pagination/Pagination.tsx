import React from "react";

import { useUpdateQueryParams } from "@/utils/updateQueryParams";

import styles from "./pagination.module.scss";

interface PaginationProps {
	pageQuantity: number;
	currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({ pageQuantity, currentPage }) => {
	const updateQueryParams = useUpdateQueryParams();

	const getPreviousPage = () => {
		if (currentPage > 1) {
			updateQueryParams({ key: "page", value: currentPage - 1 });
		}
	};

	const getNextPage = () => {
		if (currentPage < pageQuantity) {
			updateQueryParams({ key: "page", value: currentPage + 1 });
		}
	};

	return (
		<nav className={styles.container}>
			<button
				onClick={getPreviousPage}
				disabled={currentPage === 1}
				className={currentPage === 1 ? styles.disabledButton : ""}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 12H20M4 12L8 8M4 12L8 16"
						stroke="#000000"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			{[...Array(pageQuantity)].map((_, index) => (
				<button
					onClick={() => updateQueryParams({ key: "page", value: index + 1 })}
					className={index + 1 === currentPage ? styles.activePage : ""}
					key={index}>
					{index + 1}
				</button>
			))}
			<button
				onClick={getNextPage}
				disabled={currentPage === pageQuantity}
				className={currentPage === pageQuantity ? styles.disabledButton : ""}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 12H20M20 12L16 8M20 12L16 16"
						stroke="#000000"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</nav>
	);
};
