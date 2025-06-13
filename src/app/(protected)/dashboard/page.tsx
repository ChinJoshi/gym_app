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
import {
    getPlans,
    getPlannedExercises,
    getSessions,
    getSessionVolumesByPlan,
    getSessionInProgress,
    getUserExercises,
} from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { StartSessionButton } from "@/components/start-session-button";
import { PlusButton } from "@/components/ui/plus-button";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MiniChart from "@/components/mini-volume-chart";

//TODO: put plan cards in a suspense
export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const plans = await getPlans(userId);
    const executedSessions = await getSessions(userId);
    const sessionInProgress = await getSessionInProgress(userId);
    const userExercises = await getUserExercises(userId);

    // your plans
    // your sessions
    // yout trends
    return (
        <div className="flex flex-col lg:flex-row justify-center w-full gap-4 sm:gap-6 p-4 sm:p-6">
            <div className="w-full lg:w-1/3">
                <div className="flex flex-col">
                    {sessionInProgress.length > 0 && (
                        <Link
                            href={`/sessions/${sessionInProgress[0].id}`}
                            className="w-full mb-4"
                        >
                            <Button className="w-full">
                                Resume Active Session
                            </Button>
                        </Link>
                    )}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex flex-row justify-between items-center">
                                <div>Plans</div>
                                <Link href="/plan/build">
                                    <PlusButton />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {plans.map(async (plan) => {
                                const plannedExercises =
                                    await getPlannedExercises(plan.id);
                                return (
                                    <Card key={plan.id} className="my-3">
                                        <CardHeader className="w-full flex flex-row justify-between items-center">
                                            <CardTitle className="wrap-anywhere">
                                                {plan.name}
                                            </CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link
                                                        href={`/plan/edit/${plan.id}`}
                                                    >
                                                        <DropdownMenuItem>
                                                            Edit Plan
                                                        </DropdownMenuItem>
                                                    </Link>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardHeader>
                                        <CardContent>
                                            {plannedExercises.map(
                                                (plannedExercise) => (
                                                    <div
                                                        key={
                                                            plannedExercise
                                                                .planned_exercises
                                                                .id
                                                        }
                                                    >
                                                        {
                                                            plannedExercise
                                                                .exercises?.name
                                                        }
                                                    </div>
                                                )
                                            )}
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
                    <Card className="w-full mt-4">
                        <CardHeader>
                            <CardTitle className="flex flex-row justify-between items-center">
                                <div>Custom Exercises</div>
                                <Link href="/exercise/create">
                                    <PlusButton />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userExercises.map((exercise) => (
                                <Card key={exercise.id} className="my-3">
                                    <CardHeader className="w-full flex flex-row justify-between">
                                        <CardTitle className="wrap-anywhere">
                                            {exercise.name}
                                        </CardTitle>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link
                                                    href={`/exercise/edit/${exercise.id}`}
                                                >
                                                    <DropdownMenuItem>
                                                        Edit Exercise
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Card className="w-full lg:w-1/3">
                <CardHeader>
                    <CardTitle>Sessions</CardTitle>
                </CardHeader>

                <CardContent className="w-full">
                    <Table className="w-full table-fixed">
                        <TableCaption>
                            A list of your recent sessions.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[45%]">Plan</TableHead>
                                <TableHead>Volume</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {executedSessions.map(async (executedSession) => {
                                return (
                                    <TableRow key={executedSession.sessions.id}>
                                        <TableCell className="truncate">
                                            {executedSession.plans?.name}
                                        </TableCell>
                                        <TableCell>
                                            {executedSession.volume || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {executedSession.sessions
                                                .completed_at
                                                ? executedSession.sessions.completed_at.toLocaleDateString()
                                                : "In Progress"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="w-full lg:w-1/3">
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
