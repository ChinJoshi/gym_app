import { Dumbbell } from "lucide-react";
// import Link from "next/link";

export default function Footer({
    navComponents,
}: Readonly<{
    navComponents: React.ReactNode;
}>) {
    return (
        <footer className="border-t border-zinc-800 py-12">
            <div className="container">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Dumbbell className="h-6 w-6 text-rose-500" />
                        <span>Run Of One</span>
                    </div>
                    {navComponents}
                    <div className="text-sm text-zinc-500">
                        © {new Date().getFullYear()} Run Of One. All rights
                        reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
