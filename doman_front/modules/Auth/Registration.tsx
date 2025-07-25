import React from "react";
import { InputAdornment, Paper, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "./styles.module.scss";
import { useAppDispatch } from "@/redux/store";
import { registration } from "@/redux/features/authSlice";
import { User } from "@/types/user.interface";

export const Registration = ({
	setMode,
	closeAuth,
}: {
	setMode: (value: React.SetStateAction<"login" | "registration">) => void;
	closeAuth: (value: boolean) => void;
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<{
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		password: string;
	}>();

	const dispatch = useAppDispatch();

	const onSubmit: SubmitHandler<{
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		password: string;
	}> = (values) => {
		const user: User = { ...values, isAdmin: false }
		dispatch(registration(user));
		closeAuth(false);
	};

	return (
		<Paper
			onClick={(event) => event.stopPropagation()}
			elevation={3}
			className={styles.registrContainer}>
			<header>
				<p>Реєстрація</p>
			</header>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.registrContainer}>
				<TextField
					{...register("firstName", { required: "Введіть своє ім'я кирилицею" })}
					helperText={errors.firstName?.message}
					error={Boolean(errors.firstName?.message)}
					label="Ім'я"></TextField>
				<TextField
					{...register("lastName", { required: "Введіть своє прізвище кирилицею" })}
					helperText={errors.lastName?.message}
					error={Boolean(errors.lastName?.message)}
					label="Прізвище"></TextField>
				<TextField
					{...register("phoneNumber", {
						required: "Введіть номер мобільного телефону",
						minLength: 10,
						maxLength: 10,
					})}
					helperText={errors.phoneNumber?.message}
					error={Boolean(errors.phoneNumber?.message)}
					InputProps={{
						startAdornment: <InputAdornment position="start">+38</InputAdornment>,
					}}
					label="Номер телефону"></TextField>
				<TextField
					{...register("email", { required: "Введіть свою ел. пошту" })}
					helperText={errors.email?.message}
					error={Boolean(errors.email?.message)}
					label="Ел. пошта"></TextField>
				<TextField
					{...register("password",
						{
							required: "Введіть номер мобільного телефону",
							minLength: 6,
						})}
					helperText={errors.password?.message}
					error={Boolean(errors.password?.message)}
					type="password"
					label="Придумайте пароль"></TextField>
				<button type="submit" className={styles.login}>
					Зареєструватися
				</button>
				<button type="button" onClick={() => setMode("login")} className={styles.signup}>
					Я вже зареєстрований
				</button>
			</form>
		</Paper>
	);
};
