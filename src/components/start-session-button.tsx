"use client";
import { toast } from "sonner";
import { startTransition, useActionState } from "react";
import { Button } from "./ui/button";
import startSession from "@/actions/start-session";

export function StartSessionButton({ planId }: { planId: string }) {
    const [state, action, isPending] = useActionState(startSession, null);

    const handleClick = () => {
        startTransition(() => action(planId));
        if (state?.error) {
            toast("Session already in progress");
        }
    };

    return (
        <Button onClick={handleClick} disabled={isPending}>
            Start
        </Button>
    );
}
