import Cookies from "js-cookie";

import { getContentType } from "@/api/api.helper";
import { saveToStorage } from "./auth.helper";

import { AuthResponse } from "@/types/auth-response.interface";
import { Login } from "@/types/login.interface";
import { ApiRoutes } from "@/types/api-routes.enum";

import axios from "@/utils/axios";

export const AuthService = {
	async main(type: "login" | "register", data: Login) {
		const response = await axios.post<AuthResponse>(`${ApiRoutes.Auth}/${type}`, data);

		if (response.data.accessToken) {
			saveToStorage(response.data);
		}

		return response.data;
	},

	async getNewTokens() {
		const refreshToken = Cookies.get("refreshToken");

		const response = await axios.post<string, { data: AuthResponse }>(
			"/auth/login/access-token",
			{ refreshToken },
			{ headers: getContentType() }
		);

		if (response.data.accessToken) {
			saveToStorage(response.data);
		}

		return response;
	},
};
