import { getPlanFromSessionId, getExercises } from "@/db/queries";
import { sessionExecution } from "@/zod-types";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import SessionExecutionFormClientWrapper from "./SessionExecutionFormClientWrapper";
// import SessionExecutionForm from "@/components/session-execution-form";

//TODO: ensure that the session actually belongs to the user, someone could theoretically "hijack" someones session if they guessed or got their session id

export default async function Page({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;

    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;

    const planQueryResults = await getPlanFromSessionId(sessionId, userId);

    if (!planQueryResults) {
        // Handle case where session doesn't exist or user doesn't have access
        // For example, redirect or show a "not found" page
        return (
            <div>
                Session not found or you do not have permission to view it.
            </div>
        );
    }
    const exerciseChoices = await getExercises(userId);

    const planExercises = [];
    let currentExerciseNumber = null;
    for (let i = 0; i < planQueryResults.length; i++) {
        if (
            planQueryResults[i].planned_exercises?.sort_order !=
            currentExerciseNumber
        ) {
            planExercises.push({
                exercise: planQueryResults[i].exercises!.name,
                exerciseId: planQueryResults[i].exercises!.id,
                sets: [
                    {
                        reps: String(planQueryResults[i].planned_sets!.reps),
                        weight: planQueryResults[i].planned_sets?.weight
                            ? String(planQueryResults[i].planned_sets?.weight)
                            : undefined,
                        duration: planQueryResults[i].planned_sets?.duration
                            ? String(planQueryResults[i].planned_sets?.duration)
                            : undefined,
                        completed: "false",
                    },
                ],
            });
            currentExerciseNumber =
                planQueryResults[i].planned_exercises?.sort_order;
        } else {
            planExercises[planExercises.length - 1].sets.push({
                reps: String(planQueryResults[i].planned_sets!.reps),
                weight: planQueryResults[i].planned_sets?.weight
                    ? String(planQueryResults[i].planned_sets?.weight)
                    : undefined,
                duration: planQueryResults[i].planned_sets?.duration
                    ? String(planQueryResults[i].planned_sets?.duration)
                    : undefined,
                completed: "false",
            });
        }
    }
    const plan = {
        plan_name: planQueryResults[0].plans!.name,
        exercises: planExercises,
        note: "",
    } satisfies z.infer<typeof sessionExecution>;

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="max-w-4xl self-baseline p-4">
                <SessionExecutionFormClientWrapper
                    plan={plan}
                    sessionId={sessionId}
                    exercises={exerciseChoices}
                />{" "}
            </div>
        </div>
    );
}
