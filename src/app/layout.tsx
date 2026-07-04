import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
	weight: "600",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GEOFFREY!",
	description: "Real time trivia competitions",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={notoSerif.className}>
			<body>{children}</body>
		</html>
	);
}
