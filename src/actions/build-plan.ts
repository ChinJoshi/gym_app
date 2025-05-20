"use server";
import { planBuilder } from "@/zod-types";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { createPlan } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function buildPlan(
    planData: z.infer<typeof planBuilder>
) {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        throw new Error("User session not found");
    }
    const validatedPlan = planBuilder.safeParse({ ...planData });
    if (validatedPlan.success) {
        await createPlan(
            validatedPlan.data,
            session.data.session.user.id
        );
        redirect("/dashboard");
    } else {
        throw new Error(validatedPlan.error.message);
    }
}