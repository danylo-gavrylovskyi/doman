import Image from "next/image";
import Link from "next/link";
import React from "react";

import { uploadUrl } from "@/config/seo.config";

import { Category } from "@/types/category.interface";

import styles from "./DropdownCategory.module.scss";

export const DropdownCategory = ({ title, image, slug }: Category) => {
	return (
		<Link href={`/categories/${slug}`} className={styles.linkWrapper}>
			<div className={styles.container}>
				<div className={styles.imageWrapper}>
					<Image
						src={uploadUrl("categoriesImages", image) ?? ""}
						alt={title}
						fill
						sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 10vw"
						style={{ objectFit: "contain" }}
					/>
				</div>
				<p>{title}</p>
			</div>
		</Link>
	);
};
