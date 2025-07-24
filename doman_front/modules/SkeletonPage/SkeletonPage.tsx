import React from "react";

import styles from "./SkeletonPage.module.scss";

export const SkeletonPage = () => {
	return (
		<div className={styles.container}>
			<main className={styles.wrapper}>
				<div className={styles.title} />
				<section className={styles.products}>
					{[...Array(8)].map((val, index) => (
						<div key={index}></div>
					))}
				</section>
			</main>
		</div>
	);
};
