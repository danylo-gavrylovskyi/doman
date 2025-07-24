import React from "react";
import { Button, Paper } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";

import { Attribute } from "@/types/attribute.interface";

import styles from "./AdminAttribute.module.scss";

interface AdminAttributeProps extends Attribute {
	deleteAttribute: UseMutateFunction<number, unknown, number, unknown>;
}

export const AdminAttribute = ({ id, title, deleteAttribute }: AdminAttributeProps) => {
	return (
		<Paper elevation={3} className={styles.container}>
			<p>{title}</p>
			<Button onClick={() => deleteAttribute(id)} variant="contained" color="error">
				Видалити
			</Button>
		</Paper>
	);
};
