"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { useGetOrdersWithPagination } from "@/hooks/orders.hook";

import { Order } from "@/components/Order/Order";
import { Pagination } from "@/components/Pagination/Pagination";
import { ExtendedOrder } from "@/components/Order/ExtendedOrder";

import styles from "./adminOrders.module.scss";

const AdminOrders = () => {
	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const { data: orders } = useGetOrdersWithPagination({ page, perPage });

	const [extendedOrders, setExtendedOrders] = React.useState<number[]>([]);

	const toggleOrderExtension = (index: number) => {
		if (extendedOrders.includes(index)) {
			setExtendedOrders((prev) => prev.filter((el) => el !== index));
		} else {
			setExtendedOrders((prev) => [...prev, index]);
		}
	};

	return (
		<div className={styles.container}>
			<p className={styles.title}>Замовлення</p>

			{orders &&
				orders.rows.map((order, index) => {
					const options: Intl.DateTimeFormatOptions = {
						year: "numeric",
						month: "long",
						day: "numeric",
					};
					const dateFormatter = new Intl.DateTimeFormat("uk-UA", options);
					const formattedDate = dateFormatter.format(new Date(order.createdAt));

					const customer = {
						firstName: order.firstName,
						lastName: order.lastName,
						email: order.email,
						phoneNumber: order.phoneNumber,
					};

					return (
						<div
							onClick={() => toggleOrderExtension(index)}
							key={order.id}
							style={{ marginBottom: "1%", width: "90%" }}>
							{extendedOrders.includes(index) ? (
								<ExtendedOrder
									customer={customer}
									orderId={order.id}
									totalPrice={order.totalPrice}
									createdAt={formattedDate}
									orderProducts={order.orderProducts}
								/>
							) : (
								<Order
									orderId={order.id}
									totalPrice={order.totalPrice}
									createdAt={formattedDate}
									orderProducts={order.orderProducts}
									height="9dvh"
								/>
							)}
						</div>
					);
				})}

			<footer>
				{orders && orders?.count > 10 && (
					<Pagination
						pageQuantity={
							perPage && orders
								? orders.count / +perPage < 1
									? 1
									: Math.ceil(orders.count / +perPage)
								: 1
						}
						currentPage={page ? +page : 1}
					/>
				)}
			</footer>
		</div>
	);
};

export default AdminOrders;
