import { Pagination } from "@/types/pagination.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UpdateQueryParamsProps {
	key: keyof Pagination;
	value: number;
}

export const useUpdateQueryParams = () => {
	const pathName = usePathname();
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	const updateQueryParams = ({ key, value }: UpdateQueryParamsProps) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set(key, String(value));
		replace(pathName + `?${newParams.toString()}`);
	};

	return updateQueryParams;
};
