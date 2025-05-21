import { getPlanFromSessionId } from "@/db/queries";
import SessionExecutionForm from "@/components/session-execution-form";
import { planBuilder } from "@/zod-types";
import { z } from "zod";

export default async function Page({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    // TODO: write query to get plan from sessionID
    const { sessionId } = await params;
    const planQueryResults = await getPlanFromSessionId(sessionId);
    console.log(planQueryResults);
    const exercises = [];
    let currentExerciseNumber = null;
    for (let i = 0; i < planQueryResults.length; i++) {
        if (
            planQueryResults[i].planned_exercises?.sort_order !=
            currentExerciseNumber
        ) {
            exercises.push({
                exercise: planQueryResults[i].exercises!.name,
                sets: [
                    {
                        reps: String(planQueryResults[i].planned_sets!.reps),
                        weight: planQueryResults[i].planned_sets?.weight
                            ? String(planQueryResults[i].planned_sets?.weight)
                            : undefined,
                        duration: planQueryResults[i].planned_sets?.duration
                            ? String(planQueryResults[i].planned_sets?.duration)
                            : undefined,
                    },
                ],
            });
            currentExerciseNumber =
                planQueryResults[i].planned_exercises?.sort_order;
        } else {
            exercises[exercises.length - 1].sets.push({
                reps: String(planQueryResults[i].planned_sets!.reps),
                weight: planQueryResults[i].planned_sets?.weight
                    ? String(planQueryResults[i].planned_sets?.weight)
                    : undefined,
                duration: planQueryResults[i].planned_sets?.duration
                    ? String(planQueryResults[i].planned_sets?.duration)
                    : undefined,
            });
        }
    }
    const plan = {
        plan_name: planQueryResults[0].plans!.name,
        exercises: exercises,
    } satisfies z.infer<typeof planBuilder>;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-4xl self-baseline">
                <SessionExecutionForm plan={plan} />{" "}
            </div>
        </div>
    );
}
