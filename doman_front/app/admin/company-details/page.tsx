"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import { useGetCompanyDetails, useUpdateCompanyDetails } from "@/hooks/company-details.hooks";

import { CompanyDetails } from "@/types/company-details.interface";

import styles from "./CompanyDetails.module.scss";

const CompanyDetailsPage = () => {
	const { register, handleSubmit } = useForm<CompanyDetails>();

	const { data: companyDetails } = useGetCompanyDetails();
	const updateCompanyDetails = useUpdateCompanyDetails();

	const pagesNaming: [keyof CompanyDetails, string][] = [
		["payment_and_delivery_content", "Текст який буде на сторінці 'Оплата і доставка'"],
		["returns_and_exchanges_content", "Текст який буде на сторінці 'Повернення та обмін товару'"],
		["about_company_content", "Текст який буде на сторінці 'Про компанію'"],
	];

	const onSaveCompanyDetails: SubmitHandler<CompanyDetails> = (values) => {
		updateCompanyDetails(values);
	};

	if (!companyDetails) {
		return <div>Loading...</div>;
	}

	return (
		<div className={styles.container}>
			<header className={styles.heading}>Редагування інформації про компанію</header>
			<form onSubmit={handleSubmit(onSaveCompanyDetails)}>
				<main>
					{pagesNaming.map((page) => (
						<TextField
							key={page[0]}
							{...register(page[0])}
							defaultValue={companyDetails ? companyDetails[page[0]] : ""}
							name={page[0]}
							label={page[1]}
							margin="normal"
							fullWidth
							multiline
						/>
					))}

					<section>
						<TextField
							{...register("phone_number1")}
							defaultValue={companyDetails?.phone_number1}
							name={"phone_number1"}
							label="Номер телефону 1"
							margin="normal"
							style={{ marginRight: "2%" }}
						/>
						<TextField
							{...register("phone_number2")}
							defaultValue={companyDetails?.phone_number2}
							name={"phone_number2"}
							label="Номер телефону 2"
							margin="normal"
						/>
					</section>

					<section>
						<TextField
							{...register("email")}
							defaultValue={companyDetails?.email}
							name={"email"}
							label="Електронна пошта"
							margin="normal"
							style={{ marginRight: "2%", width: "35%" }}
						/>
						<TextField
							{...register("adress")}
							defaultValue={companyDetails?.adress}
							name={"adress"}
							label="Адреса"
							margin="normal"
							style={{ width: "35%" }}
						/>
					</section>

					<section>
						<TextField
							{...register("facebook_link")}
							defaultValue={companyDetails?.facebook_link}
							name={"facebook_link"}
							label="Посилання на фейсбук сторінку"
							margin="normal"
							style={{ marginRight: "2%", width: "35%" }}
						/>
						<TextField
							{...register("instagram_link")}
							defaultValue={companyDetails?.instagram_link}
							name={"instagram_link"}
							label="Посилання на інстаграм сторінку"
							margin="normal"
							style={{ width: "35%" }}
						/>
					</section>

					<footer>
						<button type="submit">Зберегти</button>
					</footer>
				</main>
			</form>
		</div>
	);
};

export default CompanyDetailsPage;
