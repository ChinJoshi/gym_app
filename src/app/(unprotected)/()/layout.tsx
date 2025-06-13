import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutHeader from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Run Of One - Track Your Fitness Journey",
    description:
        "The ultimate resistance training companion that helps you track exercises, analyze trends, and achieve consistent progress in your fitness journey.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    {/* Header */}
                    <LayoutHeader navComponents={null} signedIn={false} />
                    {children}
                    <Footer navComponents={null} />
                </ThemeProvider>
            </body>
        </html>
    );
}
