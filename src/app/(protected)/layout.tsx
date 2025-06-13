// // import type { Metadata } from "next";
// import "../globals.css";
// import Footer from "@/components/ui/footer";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ThemeProvider } from "@/components/theme-provider";
// import { signOut } from "@/actions/signout";
// import { Toaster } from "sonner";

// // export const metadata: Metadata = {
// //     title: "The Gym",
// //     description: "Track your progress",
// // };

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="en" suppressHydrationWarning>
//             <body className="flex flex-col min-h-svh">
//                 <ThemeProvider
//                     attribute="class"
//                     defaultTheme="dark"
//                     // enableSystem
//                     disableTransitionOnChange
//                 >
//                     <div className="flex flex-row justify-between">
//                         <Link href="/" className="text-2xl font-extrabold m-6">
//                             The Gym
//                         </Link>
//                         {
//                             <form action={signOut} className="m-6">
//                                 <Button type="submit">Log out</Button>
//                             </form>
//                         }
//                     </div>
//                     <main className="grow flex">{children}</main>
//                     <Toaster />
//                     <Footer />
//                 </ThemeProvider>
//             </body>
//         </html>
//     );
// }

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutHeader from "@/components/header";
import { Toaster } from "sonner";
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
                    <LayoutHeader navComponents={null} signedIn={true} />
                    {children}
                    <Toaster />
                    <Footer navComponents={null} />
                </ThemeProvider>
            </body>
        </html>
    );
}
