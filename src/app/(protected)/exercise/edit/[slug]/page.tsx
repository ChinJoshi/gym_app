import { getExerciseForEdit } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import ExerciseEditorForm from "@/components/exercise-editor-form";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return <div>Not authorized</div>;
    }
    const user = session.user;

    const exercise = await getExerciseForEdit(slug, user.id);

    if (!exercise) {
        return <div>Exercise not found</div>;
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="max-w-4xl self-baseline p-4">
                <ExerciseEditorForm
                    exercise={{
                        ...exercise,
                        muscle_group: exercise.muscle_group ?? "",
                        equipment: exercise.equipment ?? "",
                    }}
                />
            </div>
        </div>
    );
}
