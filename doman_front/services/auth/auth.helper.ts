import { AuthResponse } from "@/types/auth-response.interface";
import { Tokens } from "@/types/tokens.interface";
import Cookies from "js-cookie";

export const getAccessToken = () => {
	const accessToken = Cookies.get("accessToken");
	return accessToken || null;
};

export const getUserFromStorage = () => {
	const user = localStorage.getItem("user");
	return JSON.parse(user || "[]");
};

export const saveTokensStorage = (data: Tokens) => {
	Cookies.set("accessToken", data.accessToken);
	Cookies.set("refreshToken", data.refreshToken);
};

export const removeTokensFromStorage = () => {
	Cookies.remove("accessToken");
	Cookies.remove("refreshToken");
	localStorage.removeItem("user");
};

export const saveToStorage = (data: AuthResponse) => {
	saveTokensStorage(data);
	localStorage.setItem("user", JSON.stringify(data.user));
};
