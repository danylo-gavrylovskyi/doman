"use client";

import React from "react";
import Link from "next/link";
import { Paper } from "@mui/material";
import { usePathname } from "next/navigation";

import styles from "./AdminLayout.module.scss";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const sections = [
		{ href: "products", name: "Товари" },
		{ href: "categories", name: "Категорії" },
		{ href: "subcategories", name: "Підкатегорії" },
		{ href: "banners", name: "Банери" },
		{ href: "attributes", name: "Атрибути" },
		{ href: "orders", name: "Замовлення" },
		{ href: "company-details", name: "Про компанію" },
	];

	const pathname = usePathname().split("/");

	return (
		<>
			<aside className={styles.menu}>
				<Link href="/">
					<div className={styles.logo}>
						<img width={"150px"} src="/logo.png"></img>
					</div>
				</Link>
				<div className={styles.sections}>
					{sections.map((section, index) => (
						<Link key={section.href} href={`/admin/${section.href}`}>
							<section
								className={
									pathname[pathname.length - 1] === section.href ? styles.active : ""
								}>
								{section.name}
							</section>
						</Link>
					))}
				</div>
			</aside>
			<Paper className={styles.paper} elevation={3}>
				{children}
			</Paper>
		</>
	);
};

export default AdminLayout;
