import { getSessionInProgress } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { startSession } from "@/db/queries";
import { redirect } from "next/navigation";
// start a session
// if a session is already in progress, tell the user a session is already in progress and give them to option to end it or abandon it
// else start a new session based on the plan the user started it from

export default async function Page({
    params,
}: {
    params: Promise<{ planId: string }>;
}) {
    const { planId } = await params;
    const supabase = await createClient();
    const user_session = await supabase.auth.getSession();
    const userId = user_session.data.session!.user.id;
    const sessions_in_progress = await getSessionInProgress(userId);

    if (sessions_in_progress.length > 0) {
        console.log({ error: "Session already in progress" });
        return (
            <div>{`Session: ${sessions_in_progress[0].id} already in progress`}</div>
        );
    } else {
        const sessionId = await startSession(planId, userId);
        redirect(`/sessions/${sessionId}`);
    }
}
