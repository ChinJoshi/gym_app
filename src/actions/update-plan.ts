"use server";
import { planEditor } from "@/zod-types";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updatePlanQuery } from "@/db/queries";

export async function updatePlan(
    plan: z.infer<typeof planEditor>,
    planId: string
) {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return { error: "Not authorized" };
    }
    const user = session.user;

    if (!user) {
        return { error: "Not authorized" };
    }

    try {
        await updatePlanQuery(plan, planId);
    } catch (error) {
        console.error(error);
        return { error: "Failed to update plan" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/plan/edit/${planId}`);
    redirect("/dashboard");
}