import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { getPlans, getPlannedExercises } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { StartSessionButton } from "@/components/start-session-button";

//TODO: put plan cards in a suspense
//TODO: convert all actions to trpc
export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const plans = await getPlans(userId);
    // your plans
    // your sessions
    // yout trends
    return (
        <div className="flex flex-col sm:flex-row justify-center w-full gap-6 m-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">
                        <div>Plans</div>
                        <Link href="/plan/build">
                            <Button className="font-extrabold">+</Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {plans.map(async (plan) => {
                        const plannedExercises = await getPlannedExercises(
                            plan.id
                        );
                        return (
                            <Card key={plan.id} className="my-3">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {plannedExercises.map((plannedExercise) => (
                                        <div
                                            key={
                                                plannedExercise
                                                    .planned_exercises.id
                                            }
                                        >
                                            {plannedExercise.exercises?.name}
                                        </div>
                                    ))}
                                </CardContent>
                                {/* we should make a toast show up if the */}
                                <CardFooter>
                                    {/* <Link href={`/sessions/launch/${plan.id}`}>
                                        <Button>Start</Button>
                                    </Link> */}
                                    <StartSessionButton
                                        planId={plan.id}
                                    ></StartSessionButton>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sessions</CardTitle>
                </CardHeader>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Trends</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
