import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useCurrentUser = () => {
	return useSelector((state: RootState) => state.auth.currentUser);
};
