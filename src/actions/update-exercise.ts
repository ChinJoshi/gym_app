"use server";
import { db } from "@/db/index";
import { exercises } from "@/db/schema";
import { exerciseEditor } from "@/zod-types";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateExercise(
    exercise: z.infer<typeof exerciseEditor>,
    exerciseId: string
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

    await db
        .update(exercises)
        .set(exercise)
        .where(and(eq(exercises.id, exerciseId), eq(exercises.user_id, user.id)));

    revalidatePath("/dashboard");
    revalidatePath(`/exercise/edit/${exerciseId}`);
    redirect("/dashboard");
}