import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
    return (
        <div className="flex flex-col min-w-screen items-center gap-6 self-center">
            Track your progress!
            <br />
            - Movements
            <br />
            - Sets
            <br />
            - Reps
            <br />
            - Rest time
            <br />- Trends
            <Link href="/signup">
                <Button>Sign up</Button>
            </Link>
        </div>
    );
}
