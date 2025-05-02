import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { getRoutines, getPlannedExercises } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";

//TODO: put routine cards in a suspense
export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const routines = await getRoutines(userId);
    // your routines
    // your workouts
    // yout trends
    return (
        <div className="flex flex-row justify-center w-full gap-6 m-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">
                        <div>Routines</div>
                        <Link href="/routine/build">
                            <Button className="font-extrabold">+</Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {routines.map(async (routine) => {
                        const plannedExercises = await getPlannedExercises(
                            routine.id
                        );
                        return (
                            <Card key={routine.id} className="my-3">
                                <CardHeader>
                                    <CardTitle>{routine.name}</CardTitle>
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
                                    <Button>Start</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Workouts</CardTitle>
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
