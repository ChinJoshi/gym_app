import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// import { createClient } from "@/lib/supabase/server";
export default async function Page() {
    // const supabase = await createClient();
    // const user = await supabase.auth.getUser();
    // your routines
    // your workouts
    // yout trends
    return (
        <div>
            <Card className="w-[350] m-6">
                <CardHeader>
                    <CardTitle>Routine #1</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
