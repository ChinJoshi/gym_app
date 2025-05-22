import PlanBuilderForm from "@/components/plan-builder-form";
import { getExercises } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session!.user.id;
    const exercises = await getExercises(userId);
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-4xl self-baseline">
                <PlanBuilderForm exercises={exercises} />
            </div>
        </div>
    );
}
