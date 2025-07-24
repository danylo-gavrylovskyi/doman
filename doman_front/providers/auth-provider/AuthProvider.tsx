"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, FC } from "react";
import { PROTECTED_ROUTES } from "./protected-routes";
import { ADMIN_PANEL_URL } from "@/config/url.config";
import { getCurrentUser } from "@/hooks/get-current-user.hook";
import { NotFoundPage } from "@/components/NotFoundPage";

export const AuthProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
	const pathname = usePathname();

	const user = getCurrentUser();

	const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
	const isAdminRoute = pathname.startsWith(ADMIN_PANEL_URL);

	if (isProtectedRoute && user) return <>{children}</>;

	if (isAdminRoute && user.isAdmin) return <>{children}</>;

	if (user.isAdmin) return <>{children}</>;

	if (!isAdminRoute && !isProtectedRoute) return <>{children}</>;

	if (user && isAdminRoute) return <NotFoundPage />;
};
