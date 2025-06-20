"use client";

import dynamic from "next/dynamic";
import { z } from "zod";
import { sessionExecution } from "@/zod-types";

const SessionExecutionForm = dynamic(
    () => import("@/components/session-execution-form"),
    { ssr: false }
);

type SessionExecutionFormProps = {
    plan: z.infer<typeof sessionExecution>;
    sessionId: string;
    exercises: {
        id: string;
        name: string;
        muscle_group: string | null;
        equipment: string | null;
        is_custom: boolean | null;
        user_id: string | null;
    }[];
};

export default function SessionExecutionFormClientWrapper(
    props: SessionExecutionFormProps
) {
    return <SessionExecutionForm {...props} />;
}
