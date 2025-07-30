"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Header } from "@/modules/Header/Header";
import { Footer } from "@/modules/Footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const HeaderProvider: React.FC = () => {
	const pathname = usePathname();
	return <>{!pathname.includes("admin") && <Header />}</>;
};

export const FooterProvider = () => {
	const pathname = usePathname();
	return <>{!pathname.includes("admin") && <Footer />}</>;
};

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
