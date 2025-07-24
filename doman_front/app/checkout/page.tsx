"use client";

import React from "react";
import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { Paper, TextField } from "@mui/material";
import Link from "next/link";

import { RootState, useAppDispatch } from "@/redux/store";
import { clearCart } from "@/redux/features/cartSlice";

import { OrdersService } from "@/services/orders.service";
import { Order } from "@/types/order.interface";

import { getCartTotalPrice } from "@/utils/getCartTotalPrice";

import styles from "./CheckoutPage.module.scss";

const page = () => {
	const dispatch = useAppDispatch();

	const cartProducts = useSelector((state: RootState) => state.cart.cartProducts);
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);

	const totalPrice: number = getCartTotalPrice(cartProducts);
	const productsQuantity: number = cartProducts.reduce((prev, cur) => prev + cur.quantity, 0);

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			phoneNumber: `${currentUser.phoneNumber}`,
			email: `${currentUser.email}`,
			lastName: `${currentUser.lastName}`,
			firstName: `${currentUser.firstName}`,
		},
	});

	const onSubmit: SubmitHandler<{
		phoneNumber: string;
		email: string;
		lastName: string;
		firstName: string;
	}> = async (values) => {
		const { firstName, lastName, email, phoneNumber } = values;

		const data: Order = {
			firstName,
			lastName,
			email,
			phoneNumber,
			totalPrice,
			orderedProducts: cartProducts,
		};

		await OrdersService.placeOrder(data);
		dispatch(clearCart());
	};

	return (
		<div className={styles.container}>
			<Paper elevation={8} className={styles.paper}>
				<p style={{ fontSize: "22px", fontWeight: "600", marginBottom: "6%" }}>
					Оформлення замовлення
				</p>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<TextField
						label="Мобільний телефон"
						helperText={errors.phoneNumber?.message}
						error={Boolean(errors.phoneNumber?.message)}
						{...register("phoneNumber", {
							required: "Введіть номер мобільного телефону",
						})}></TextField>
					<TextField
						label="Електронна пошта"
						helperText={errors.email?.message}
						error={Boolean(errors.email?.message)}
						{...register("email")}></TextField>
					<TextField
						label="Прізвище"
						helperText={errors.lastName?.message}
						error={Boolean(errors.lastName?.message)}
						{...register("lastName", {
							required: "Введіть своє прізвище кирилицею",
						})}></TextField>
					<TextField
						label="Ім'я"
						helperText={errors.firstName?.message}
						error={Boolean(errors.firstName?.message)}
						{...register("firstName", {
							required: "Введіть своє ім'я кирилицею",
						})}></TextField>
					<div>{productsQuantity} товари на суму</div>
					<span style={{ fontWeight: "600" }}>{totalPrice} ₴</span>
					<Link className={styles.backBtn} href="/">
						<button type="button">На головну</button>
					</Link>
					<button type="submit">Замовлення підтверджую</button>
				</form>
			</Paper>
		</div>
	);
};

export default page;
