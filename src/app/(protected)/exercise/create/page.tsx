import ExerciseCreationForm from "@/components/exercise-creation-form";
import { createClient } from "@/lib/supabase/server";

export default async function ExercisesPage() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        throw new Error("User session not found");
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="max-w-4xl self-baseline p-4">
                <ExerciseCreationForm />
            </div>
        </div>
    );
}
