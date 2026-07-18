import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import cartSlice from "./features/cartSlice";
import homeSlice from "./features/homeSlice";
import filterSlice from "./features/filterSlice";
import headerSlice from "./features/headerSlice";
import adminGeneralSlice from "./features/admin/adminGeneralSlice";
import authSlice from "./features/authSlice";

const isClient = typeof window !== "undefined";

const combinedReducers = combineReducers({
	cart: cartSlice,
	filter: filterSlice,
	home: homeSlice,
	header: headerSlice,
	auth: authSlice,
	adminGeneral: adminGeneralSlice,
});

let mainReducer = combinedReducers;

if (isClient) {
	const { persistReducer } = require("redux-persist");
	const storage = require("redux-persist/lib/storage").default;

	const persistConfig = {
		key: "doman",
		storage,
		whitelist: ["cart", "auth"],
	};

	mainReducer = persistReducer(persistConfig, combinedReducers);
}

export const store = configureStore({
	reducer: mainReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
