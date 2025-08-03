"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import {
	useGetOrdersByPhoneNumberPagination,
} from "@/hooks/orders.hook";

import { RootState } from "@/redux/store";

import { Order } from "@/components/Order/Order";
import { Pagination } from "@/components/Pagination/Pagination";
import { ExtendedOrder } from "@/components/Order/ExtendedOrder";

import styles from "./orders.module.scss";
import { sanitizePagination } from "@/utils/sanitizePagination";
import { PAGINATION_FALLBACK_PAGE, PAGINATION_FALLBACK_PER_PAGE } from "@/types/constants/paginationFallbackValues";

const page = () => {
	const queryParams = useSearchParams();
	const perPage = sanitizePagination(queryParams.get("perPage"), PAGINATION_FALLBACK_PER_PAGE)
	const page = sanitizePagination(queryParams.get("page"), PAGINATION_FALLBACK_PAGE);

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

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const dateFormatter = new Intl.DateTimeFormat("uk-UA", options);

	return (
		<div className={styles.container}>
			<p className={styles.title}>Мої замовлення</p>

			{orders ? (
				orders.rows.map((order, index) => {
					const formattedDate = dateFormatter.format(new Date(order.createdAt));

					return (
						<div
							onClick={() => toggleOrderExtension(index)}
							key={order.id}
							className={styles.order}>
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
						elementsCount={orders.count}
						perPage={perPage}
						currentPage={page}
					/>
				)}
			</footer>
		</div>
	);
};

export default page;
