"use server";
import { exerciseCreator } from "@/zod-types";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { createExercise } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function createExerciseAction(
    exerciseData: z.infer<typeof exerciseCreator>
) {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        throw new Error("User session not found");
    }
    const validatedExercise = exerciseCreator.safeParse({ ...exerciseData });
    if (validatedExercise.success) {
        await createExercise(
            validatedExercise.data,
            session.data.session.user.id
        );
        redirect("/dashboard");
    } else {
        throw new Error(validatedExercise.error.message);
    }
}