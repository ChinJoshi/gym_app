import { getPlanForEdit, getExercises } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import PlanEditorForm from "@/components/plan-editor-form";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <div>Not authorized</div>;
    }

    const planData = await getPlanForEdit(slug, user.id);
    const exercises = await getExercises(user.id);

    if (!planData) {
        return <div>Plan not found</div>;
    }

    type Exercise = {
        id: string;
        exercise: string;
        exerciseId: string;
        sets: {
            id: string;
            reps: string;
            weight: string;
            duration: string;
        }[];
    };

    const plan = {
        id: planData[0].plans.id,
        plan_name: planData[0].plans.name,
        exercises: planData.reduce((acc: Exercise[], row) => {
            if (!row.planned_exercises || !row.exercises) {
                return acc;
            }

            let exercise = acc.find((e) => e.id === row.planned_exercises!.id);
            if (!exercise) {
                exercise = {
                    id: row.planned_exercises.id,
                    exercise: row.exercises.name,
                    exerciseId: row.exercises.id,
                    sets: [],
                };
                acc.push(exercise);
            }

            if (row.planned_sets) {
                exercise.sets.push({
                    id: row.planned_sets.id,
                    reps: String(row.planned_sets.reps ?? ""),
                    weight: String(row.planned_sets.weight ?? ""),
                    duration: String(row.planned_sets.duration ?? ""),
                });
            }

            return acc;
        }, []),
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="max-w-4xl self-baseline p-4">
                <PlanEditorForm exercises={exercises} plan={plan} />{" "}
            </div>
        </div>
    );
}
