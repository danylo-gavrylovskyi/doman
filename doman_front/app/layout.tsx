import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReduxProvider } from "@/redux/provider";
import { FooterProvider, HeaderProvider, ReactQueryProvider } from "@/components/LayoutProvider";
import { Cart } from "@/modules/Cart/Cart";
import { HamburgerMenu } from "@/modules/HamburgerMenu/HamburgerMenu";
import { AuthProvider } from "@/providers/auth-provider/AuthProvider";
import { ProductsService } from "@/services/products.service";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Doman",
	description: "Description",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const products = await ProductsService.getAll();

	return (
		<html lang="en">
			<link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
			<body className={inter.className}>
				<ReduxProvider>
					<ReactQueryProvider>
						<AuthProvider>
							<Cart />
							<HamburgerMenu />
							<HeaderProvider products={products} />
							{children}
							<FooterProvider />
						</AuthProvider>
					</ReactQueryProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
