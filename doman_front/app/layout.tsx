import { Inter } from "next/font/google";

import { SITE, absoluteUrl } from "@/config/seo.config";
import { AuthProvider } from "@/providers/auth-provider/AuthProvider";

import { ReduxProvider } from "@/redux/provider";

import { Cart } from "@/modules/Cart/Cart";
import { HamburgerMenu } from "@/modules/HamburgerMenu/HamburgerMenu";

import { JsonLd } from "@/components/JsonLd";
import { FooterProvider, HeaderProvider, ReactQueryProvider } from "@/components/LayoutProvider";


import type { Metadata, Viewport } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
	metadataBase: new URL(SITE.url),
	title: {
		default: SITE.title,
		template: `%s | ${SITE.name}`,
	},
	description: SITE.description,
	applicationName: SITE.name,
	openGraph: {
		type: "website",
		locale: SITE.locale,
		url: SITE.url,
		siteName: SITE.name,
		title: SITE.title,
		description: SITE.description,
		images: [{ url: "/logo.png", width: 300, height: 80, alt: SITE.name }],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE.title,
		description: SITE.description,
		images: ["/logo.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	icons: {
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
	},
};

export const viewport: Viewport = {
	themeColor: SITE.themeColor,
	width: "device-width",
	initialScale: 1,
};

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: SITE.name,
	url: SITE.url,
	logo: absoluteUrl("/logo.png"),
};

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE.name,
	url: SITE.url,
	inLanguage: "uk-UA",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="uk">
			<body className={inter.className}>
				<JsonLd data={organizationJsonLd} />
				<JsonLd data={websiteJsonLd} />
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
