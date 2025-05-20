import { endSession } from "@/actions/end-session";
import { Button } from "@/components/ui/button";

export default async function Page({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;
    return (
        <div>
            Session {sessionId}
            <form action={endSession}>
                <input type="hidden" value={sessionId} name="sessionId"></input>
                <Button type="submit">End Session</Button>
            </form>
        </div>
    );
}
