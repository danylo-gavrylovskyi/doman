import React from "react";

import { ExtendedOrderProps } from "./orderProps.interface";

import styles from "./order.module.scss";

export const ExtendedOrder = ({
	customer,
	orderId,
	totalPrice,
	createdAt,
	orderProducts,
}: ExtendedOrderProps) => {
	return (
		<section className={`${styles.minimizedOrder}`}>
			<header className={styles.orderHeader}>
				<div className={styles.info}>
					<span className={styles.bold}>№ {orderId}</span>
					<span>від {createdAt}</span>
				</div>

				<div>
					<svg width="25px" viewBox="0 0 24 24" fill="none">
						<path
							d="M17 15L12 10L7 15"
							stroke="rgb(0, 136, 204)"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"></path>
					</svg>
				</div>
			</header>

			<main className={styles.flexRowAlignCenter} style={{ alignItems: "flex-start" }}>
				<div className={styles.receiver}>
					<span className={styles.bold}>Отримувач замовлення</span>
					<span>
						{customer.firstName} {customer.lastName}
					</span>
					<span>{customer.phoneNumber}</span>
					<span>{customer.email}</span>
				</div>

				<div>
					{orderProducts.map((orderProduct) => {
						const { product } = orderProduct;
						return (
							<div
								key={product.id}
								className={`${styles.flexRowAlignCenter} ${styles.orderProduct}`}>
								<div style={{ display: "flex", width: "50%", alignItems: "center" }}>
									<img
										width="15%"
										src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${product.image}`}
										alt={product.slug}></img>
									<div style={{ marginLeft: "5%" }}>{product.title}</div>
								</div>
								<div>
									{product.price}₴ x {orderProduct.quantity} од.
								</div>
								<div className={styles.bold}>{orderProduct.quantity * product.price} ₴</div>
								<div className={styles.separator}></div>
							</div>
						);
					})}

					<div className={styles.flexRowAlignCenter}>
						<span className={styles.totalPriceText}>Разом</span>
						<span className={styles.bold}>
							<b>{totalPrice}</b> ₴
						</span>
					</div>
				</div>
			</main>
		</section>
	);
};
