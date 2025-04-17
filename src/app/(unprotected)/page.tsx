import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
export default async function Home() {
    const supabase = await createClient();
    const userSession = await supabase.auth.getSession();
    const user = userSession.data.session?.user;
    function signUpButton() {
        if (!user) {
            return (
                <Link href="/signup">
                    <Button>Sign up</Button>
                </Link>
            );
        } else {
            return "";
        }
    }
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
            <br />- Trends{}
            {signUpButton()}
        </div>
    );
}
