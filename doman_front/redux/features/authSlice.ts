import { User } from "@/types/user.interface";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthService } from "@/services/auth/auth.service";
import { removeTokensFromStorage } from "@/services/auth/auth.helper";
import { Login } from "@/types/login.interface";
import { AuthResponse } from "@/types/auth-response.interface";

export const login = createAsyncThunk<AuthResponse, Login>("auth/login", async (values: Login) => {
	const data = await AuthService.main("login", values);
	return data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
	removeTokensFromStorage();
});

export const registration = createAsyncThunk<AuthResponse, User>(
	"auth/register",
	async (values: {
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
		password: string;
	}) => {
		const data = await AuthService.main("register", values);
		return data;
	}
);

interface AuthSliceProps {
	currentUser: User;
}

const initialState: AuthSliceProps = {
	currentUser: {} as User,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
			state.currentUser = action.payload.user;
		});
		builder.addCase(registration.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
			state.currentUser = action.payload.user;
		});
		builder.addCase(logout.fulfilled, (state) => {
			state.currentUser = {} as User;
		});
	},
});

export default authSlice.reducer;
