"use server";
import { routineBuilder } from "@/zod_types";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { createRoutine } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function buildRoutine(
    routineData: z.infer<typeof routineBuilder>
) {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        throw new Error("User session not found");
    }
    const validatedRoutine = routineBuilder.safeParse({ ...routineData });
    if (validatedRoutine.success) {
        await createRoutine(
            validatedRoutine.data,
            session.data.session.user.id
        );
        redirect("/dashboard");
    } else {
        throw new Error(validatedRoutine.error.message);
    }
}
