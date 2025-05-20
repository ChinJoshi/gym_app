import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { signOut } from "@/actions/signout";
import { Toaster } from "sonner";
export const metadata: Metadata = {
    title: "The Gym",
    description: "Track your progress",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="flex flex-col min-h-svh">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    // enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-row justify-between">
                        <Link href="/" className="text-2xl font-extrabold m-6">
                            The Gym
                        </Link>
                        {
                            <form action={signOut} className="m-6">
                                <Button type="submit">Log out</Button>
                            </form>
                        }
                    </div>
                    <main className="grow flex">{children}</main>
                    <Toaster />
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
