"use client";

import { Paper, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { clearCart } from "@/redux/features/cartSlice";
import { RootState, useAppDispatch } from "@/redux/store";

import { OrdersService } from "@/services/orders.service";

import { getCartTotalPrice } from "@/utils/getCartTotalPrice";

import { Order } from "@/types/order.interface";

import styles from "./CheckoutPage.module.scss";

const Checkout = () => {
	const dispatch = useAppDispatch();
	const { push } = useRouter();

	const cartProducts = useSelector((state: RootState) => state.cart.cartProducts);
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);

	const totalPrice: number = getCartTotalPrice(cartProducts);
	const productsQuantity: number = cartProducts.reduce((prev, cur) => prev + cur.quantity, 0);

	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			phoneNumber: currentUser.phoneNumber ?? "",
			email: currentUser.email ?? "",
			lastName: currentUser.lastName ?? "",
			firstName: currentUser.firstName ?? "",
		},
	});

	const onSubmit: SubmitHandler<{
		phoneNumber: string;
		email: string;
		lastName: string;
		firstName: string;
	}> = async (values) => {
		if (cartProducts.length === 0) {
			setSubmitError("Ваш кошик порожній");
			return;
		}

		const { firstName, lastName, email, phoneNumber } = values;

		const data: Order = {
			firstName,
			lastName,
			email,
			phoneNumber,
			totalPrice,
			orderedProducts: cartProducts,
		};

		try {
			setSubmitError(null);
			setIsSubmitting(true);
			await OrdersService.placeOrder(data);
			dispatch(clearCart());
			push("/");
		} catch {
			setSubmitError("Не вдалося оформити замовлення. Спробуйте ще раз");
		} finally {
			setIsSubmitting(false);
		}
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
					{submitError && <p className={styles.submitError}>{submitError}</p>}
					<Link className={styles.backBtn} href="/">
						На головну
					</Link>
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Оформлення..." : "Замовлення підтверджую"}
					</button>
				</form>
			</Paper>
		</div>
	);
};

export default Checkout;
