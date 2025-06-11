import PlanBuilderForm from "@/components/plan-builder-form";
import { getExercises } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const exercises = await getExercises(userId);
    return (
        <div className="flex min-h-svh w-full items-center justify-center">
            <div className="max-w-4xl self-baseline p-4">
                <PlanBuilderForm exercises={exercises} />
            </div>
        </div>
    );
}
