import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleAttribute } from "@/redux/features/filterSlice";
import { RootState } from "@/redux/store";

import styles from "./FilterBlock.module.scss";

interface FilterProps {
	attributeName: string;
	attributeValues: string[];
}

export const FilterBlock = ({ attributeName, attributeValues }: FilterProps) => {
	const checkedAttributes = useSelector((state: RootState) => state.filter.checkedAttributes);
	const dispatch = useDispatch();

	return (
		<Paper elevation={3} className={styles.container}>
			<h1>{attributeName}</h1>
			<FormGroup>
				{attributeValues.map((value: string) => (
					<FormControlLabel
						checked={checkedAttributes.some(attr => attr.title === attributeName && attr.values.includes(value))}
						onChange={() => dispatch(toggleAttribute({ title: attributeName, value }))}
						key={value}
						control={<Checkbox />}
						label={value}
					/>
				))}
			</FormGroup>
		</Paper>
	);
};
