import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getPlans, getPlannedExercises, getSessions } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { StartSessionButton } from "@/components/start-session-button";
import { Plus } from "lucide-react";
import MiniChart from "@/components/mini-volume-chart";
import { getSessionVolumesByPlan } from "@/db/queries";

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
                                    <CardTitle className="wrap-anywhere">
                                        {plan.name}
                                    </CardTitle>
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
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableCaption>
                            A list of your recent sessions.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan</TableHead>
                                <TableHead>Volume</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {executedSessions.map(async (executedSession) => {
                                return (
                                    <TableRow key={executedSession.sessions.id}>
                                        <TableCell className="max-w-40 overflow-hidden text-ellipsis">
                                            {executedSession.plans?.name}
                                        </TableCell>
                                        <TableCell>
                                            {executedSession.volume}
                                        </TableCell>
                                        <TableCell>
                                            {executedSession.sessions
                                                .completed_at
                                                ? executedSession.sessions.completed_at.toLocaleString()
                                                : "In Progress"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Trends</CardTitle>
                    Trends organized by plan type
                </CardHeader>
                <CardContent>
                    {plans.map(async (plan) => {
                        const volumes = await getSessionVolumesByPlan(plan.id);
                        if (volumes.length == 0) {
                            return null;
                        }
                        return (
                            <Card key={plan.id} className="my-3">
                                <CardHeader>
                                    <CardTitle className="wrap-anywhere">
                                        {plan.name} Volume
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MiniChart volumes={volumes} />
                                </CardContent>
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
