import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { getPlans, getPlannedExercises, getSessions } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { StartSessionButton } from "@/components/start-session-button";
import { Plus } from "lucide-react";
import MiniChart from "@/components/mini-volume-chart";
import { getSessionVolumes } from "@/db/queries";

//TODO: put plan cards in a suspense
export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const plans = await getPlans(userId);
    const executedSessions = await getSessions(userId);

    // your plans
    // your sessions
    // yout trends
    return (
        <div className="flex flex-col lg:flex-row justify-center w-full gap-6 m-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">
                        <div>Plans</div>
                        <Link href="/plan/build">
                            <Button className="font-extrabold">
                                <Plus />
                            </Button>
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
                                <CardFooter>
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
                    <CardContent>
                        {executedSessions.map(async (executedSession) => {
                            return (
                                <Card
                                    key={executedSession.sessions.id}
                                    className="my-3"
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            {`${
                                                executedSession.plans!.name
                                            } Session`}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent></CardContent>
                                    <CardFooter></CardFooter>
                                </Card>
                            );
                        })}
                    </CardContent>
                </CardHeader>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Trends</CardTitle>
                    Trends organized by plan type
                </CardHeader>
                <CardContent>
                    {plans.map(async (plan) => {
                        return (
                            <Card key={plan.id} className="my-3">
                                <CardHeader>
                                    <CardTitle>{plan.name} Volume</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MiniChart
                                        volumes={await getSessionVolumes(
                                            plan.id
                                        )}
                                    />
                                </CardContent>
                                {/* <CardFooter>
                                    <Link href={`/trends/${plan.id}`}>
                                        <Button>View Trends</Button>
                                    </Link>
                                </CardFooter> */}
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
