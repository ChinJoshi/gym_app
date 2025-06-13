import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutHeader from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

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
    const headerNavComponents = (
        <nav className="hidden md:flex items-center gap-6">
            <Link
                href="#features"
                className="text-sm font-medium text-zinc-300 hover:text-white"
            >
                Features
            </Link>
            <Link
                href="#how-it-works"
                className="text-sm font-medium text-zinc-300 hover:text-white"
            >
                How It Works
            </Link>
        </nav>
    );
    // const footerNavComponenets = (
    //     <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
    //         <Link
    //             href="#features"
    //             className="text-sm text-zinc-400 hover:text-white"
    //         >
    //             Features
    //         </Link>
    //         <Link
    //             href="#how-it-works"
    //             className="text-sm text-zinc-400 hover:text-white"
    //         >
    //             How It Works
    //         </Link>
    //         {/* <Link
    //             href="/pricing"
    //             className="text-sm text-zinc-400 hover:text-white"
    //         >
    //             Pricing
    //         </Link>
    //         <Link
    //             href="/privacy"
    //             className="text-sm text-zinc-400 hover:text-white"
    //         >
    //             Privacy
    //         </Link>
    //         <Link
    //             href="/terms"
    //             className="text-sm text-zinc-400 hover:text-white"
    //         >
    //             Terms
    //         </Link> */}
    //     </nav>
    // );
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    {/* Header */}
                    <LayoutHeader
                        navComponents={headerNavComponents}
                        signedIn={false}
                    />
                    {children}
                    <Footer navComponents={null} />
                </ThemeProvider>
            </body>
        </html>
    );
}
