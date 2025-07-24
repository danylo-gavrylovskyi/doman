import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const getCurrentUser = () => {
	return useSelector((state: RootState) => state.auth.currentUser);
};
