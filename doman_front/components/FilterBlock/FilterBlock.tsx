import React from "react";
import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { toggleAttribute } from "@/redux/features/filterSlice";

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
				{attributeValues.map((value: string, index: number) => (
					<FormControlLabel
						checked={checkedAttributes.includes(value)}
						onChange={() => dispatch(toggleAttribute(value))}
						key={value}
						control={<Checkbox />}
						label={value}
					/>
				))}
			</FormGroup>
		</Paper>
	);
};
