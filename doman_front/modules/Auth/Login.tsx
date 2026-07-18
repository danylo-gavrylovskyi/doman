import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Paper, TextField } from "@mui/material";

import { useAppDispatch } from "@/redux/store";
import { login } from "@/redux/features/authSlice";

import styles from "./styles.module.scss";

export const Login = ({
	setMode,
	closeAuth,
}: {
	setMode: (value: React.SetStateAction<"login" | "registration">) => void;
	closeAuth: (value: boolean) => void;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string; password: string }>();

	const dispatch = useAppDispatch();

	const [authError, setAuthError] = React.useState<string | null>(null);

	const onSubmit: SubmitHandler<{ email: string; password: string }> = async (values) => {
		try {
			setAuthError(null);
			await dispatch(login(values)).unwrap();
			closeAuth(false);
		} catch {
			setAuthError("Невірна ел. пошта або пароль");
		}
	};

	return (
		<Paper
			onClick={(event) => event.stopPropagation()}
			elevation={3}
			className={styles.loginContainer}>
			<header>
				<p>Вхід</p>
			</header>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.loginContainer}>
				<TextField
					{...register("email", {
						required: "Введено невірну адресу ел. пошти",
					})}
					helperText={errors.email?.message}
					error={Boolean(errors.email?.message)}
					label="Ел. пошта"></TextField>
				<TextField
					{...register("password", {
						required: "Введено невірний пароль",
					})}
					helperText={errors.password?.message}
					error={Boolean(errors.password?.message)}
					type="password"
					label="Пароль"></TextField>
				{authError && <p className={styles.authError}>{authError}</p>}
				<button type="submit" className={styles.login}>
					Увійти
				</button>
				<button type="button" onClick={() => setMode("registration")} className={styles.signup}>
					Зареєструватися
				</button>
			</form>
		</Paper>
	);
};
