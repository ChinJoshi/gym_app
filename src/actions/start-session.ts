"use server";

import { getSessionInProgress } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { startSession as startSessionDb } from "@/db/queries";
import { redirect } from "next/navigation";
// start a session
// if a session is already in progress, tell the user a session is already in progress and give them to option to end it or abandon it
// else start a new session based on the plan the user started it from

export default async function startSession (prevState: { error: string; } | null,planId: string) {
    const supabase = await createClient();
    const user_session = await supabase.auth.getSession();
    const userId = user_session.data.session!.user.id;

    const sessions_in_progress = await getSessionInProgress(userId);
    if (sessions_in_progress.length > 0) {
        return { error: "Session already in progress" };
    }
    const sessionId = await startSessionDb(planId, userId);
    redirect(`/sessions/${sessionId}`);
}
