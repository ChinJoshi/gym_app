import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/signout";

export default function LayoutHeader({
    navComponents,
    signedIn,
}: Readonly<{
    navComponents: React.ReactNode;
    signedIn: boolean;
}>) {
    return (
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Dumbbell className="h-6 w-6 text-rose-500" />
                        <span>Run Of One</span>
                    </div>
                </Link>

                {navComponents}

                {!signedIn && (
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="flex border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                            >
                                Log In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                )}
                {signedIn && (
                    <div className="flex items-center gap-4">
                        <form action={signOut} className="m-6">
                            <Button
                                type="submit"
                                variant="outline"
                                className="flex border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                            >
                                Log Out
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
}
