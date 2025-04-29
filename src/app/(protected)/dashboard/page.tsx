import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

// import { createClient } from "@/lib/supabase/server";
export default async function Page() {
    // const supabase = await createClient();
    // const user = await supabase.auth.getSession();
    // your routines
    // your workouts
    // yout trends
    return (
        <div className="flex flex-row justify-center w-view gap-6 m-6">
            <Card className="w-[350]">
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">
                        <div>Routines</div>
                        <Link href="/routine/build">
                            <Button className="font-extrabold">+</Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Card>
                        <CardHeader>
                            <CardTitle>Routine Name</CardTitle>
                        </CardHeader>
                        <CardContent> Routine contents </CardContent>
                        <CardFooter>
                            <Button>Start Routine</Button>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>
            <Card className="w-[350]">
                <CardHeader>
                    <CardTitle>Workouts</CardTitle>
                </CardHeader>
            </Card>
            <Card className="w-[350]">
                <CardHeader>
                    <CardTitle>Trends</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
