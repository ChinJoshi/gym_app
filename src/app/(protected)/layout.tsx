import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/theme_provider";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Gym app",
    description: "Track your progress",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    async function signOutAction() {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        return redirect("/");
    }
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
                            Jag app
                        </Link>
                        {
                            <form action={signOutAction} className="m-6">
                                <Button type="submit">Log out</Button>
                            </form>
                        }
                    </div>
                    <main className="grow flex">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
