import { z } from "zod";

export const loginUser = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

export const routineBuilder = z.object({
    routine_name: z.string(),
    exercises: z.array(
        z.object({
            exercise: z.string(),
            sets: z.array(
                z.object({
                    reps: z.number(),
                    weight: z.number().nullable(),
                    duration: z.number().nullable(),
                })
            ),
        })
    ),
});
