"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import {
	useGetOrdersByPhoneNumberPagination,
	useGetOrdersWithPagination,
} from "@/hooks/orders.hook";

import { RootState } from "@/redux/store";

import { Order } from "@/components/Order/Order";
import { Pagination } from "@/components/Pagination/Pagination";
import { ExtendedOrder } from "@/components/Order/ExtendedOrder";

import styles from "./orders.module.scss";

const page = () => {
	const queryParams = useSearchParams();
	const perPage = queryParams.get("perPage") || "4";
	const page = queryParams.get("page") || "1";

	const currentUser = useSelector((state: RootState) => state.auth.currentUser);

	const { data: orders } = useGetOrdersByPhoneNumberPagination({
		page,
		perPage,
		phoneNumber: currentUser.phoneNumber,
	});

	const [extendedOrders, setExtendedOrders] = React.useState<number[]>([]);

	const toggleOrderExtension = (index: number) => {
		if (extendedOrders.includes(index)) {
			setExtendedOrders((prev) => prev.filter((el) => el !== index));
		} else {
			setExtendedOrders((prev) => [...prev, index]);
		}
	};

	return (
		<div style={{ width: "100%" }}>
			<p className={styles.title}>Мої замовлення</p>

			{orders ? (
				orders.rows.map((order, index) => {
					const options: Intl.DateTimeFormatOptions = {
						year: "numeric",
						month: "long",
						day: "numeric",
					};
					const dateFormatter = new Intl.DateTimeFormat("uk-UA", options);
					const formattedDate = dateFormatter.format(new Date(order.createdAt));

					return (
						<div
							onClick={() => toggleOrderExtension(index)}
							key={order.id}
							style={{ marginBottom: "1%" }}>
							{extendedOrders.includes(index) ? (
								<ExtendedOrder
									customer={currentUser}
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
								/>
							)}
						</div>
					);
				})
			) : (
				<div>No orders</div>
			)}

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

export default page;
