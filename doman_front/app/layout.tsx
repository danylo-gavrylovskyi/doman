import { Inter } from "next/font/google";

import { AuthProvider } from "@/providers/auth-provider/AuthProvider";

import { ReduxProvider } from "@/redux/provider";

import { Cart } from "@/modules/Cart/Cart";
import { HamburgerMenu } from "@/modules/HamburgerMenu/HamburgerMenu";

import { FooterProvider, HeaderProvider, ReactQueryProvider } from "@/components/LayoutProvider";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Doman",
	description: "Description",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
			<body className={inter.className}>
				<ReduxProvider>
					<ReactQueryProvider>
						<AuthProvider>
							<Cart />
							<HamburgerMenu />
							<HeaderProvider />
							{children}
							<FooterProvider />
						</AuthProvider>
					</ReactQueryProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
