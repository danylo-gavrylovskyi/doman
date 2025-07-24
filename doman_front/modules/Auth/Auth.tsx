import React from "react";

import styles from "./styles.module.scss";
import { Login } from "./Login";
import { Registration } from "./Registration";

export const Auth = ({
	toggleAuth,
}: {
	toggleAuth: (value: React.SetStateAction<boolean>) => void;
}) => {
	const [loginOrRegistr, setMode] = React.useState<"login" | "registration">("login");

	return (
		<>
			<div onClick={() => toggleAuth((prev) => !prev)} className={styles.darkBg}>
				{loginOrRegistr === "login" && <Login closeAuth={toggleAuth} setMode={setMode} />}
				{loginOrRegistr === "registration" && (
					<Registration closeAuth={toggleAuth} setMode={setMode} />
				)}
			</div>
		</>
	);
};
