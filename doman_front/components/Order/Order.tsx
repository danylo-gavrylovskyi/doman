import Image from "next/image";
import React from "react";

import styles from "./order.module.scss";
import { OrderProps } from "./orderProps.interface";

export const Order = ({ orderId, totalPrice, createdAt, orderProducts, height }: OrderProps) => {
	return (
		<section
			style={{ height }}
			className={`${styles.minimizedOrder} ${styles.flexRowAlignCenter}`}>
			<div className={styles.sideInfo}>
				<span className={styles.bold}>№ {orderId}</span> від {createdAt}
			</div>

			<div className={styles.orderedProductsImages}>
				{orderProducts.map((orderProduct) => (
					<div key={orderProduct.id} className={styles.imageWrapper}>
						<Image
							src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${orderProduct.product.image}`}
							alt={orderProduct.product.slug}
							fill
							sizes="(max-width: 768px) 15vw, 5vw"
							style={{ objectFit: "contain" }}
						/>
					</div>
				))}
			</div>

			<div className={styles.flexRowAlignCenter}>
				<div style={{ marginRight: "10%" }} className={styles.sideInfo}>
					<span>До сплати</span>
					<span className={styles.bold}>{totalPrice} ₴</span>
				</div>
				<svg width="35px" viewBox="0 0 24 24" fill="none">
					<path
						d="M7 10L12 15L17 10"
						stroke="rgb(0, 136, 204)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"></path>
				</svg>
			</div>
		</section>
	);
};
