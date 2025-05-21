"use client";
import { toast } from "sonner";
import { startTransition, useActionState } from "react";
import { Button } from "./ui/button";
import startSession from "@/actions/start-session";
import { useEffect } from "react";

export function StartSessionButton({ planId }: { planId: string }) {
    const [state, action, isPending] = useActionState(startSession, null);

    const handleClick = () => {
        startTransition(async () => {
            action(planId);
        });
    };

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Button onClick={handleClick} disabled={isPending}>
            Start
        </Button>
    );
}
