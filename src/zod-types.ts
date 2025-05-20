import { z } from "zod";

export const loginUser = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

const numericString = (message: string) => z.string().regex(/^\d*$/, message);

export const planBuilder = z.object({
    plan_name: z.string().min(1, {
        message: "Plan name must include at least 1 character",
    }),
    exercises: z.array(
        z.object({
            exercise: z.string().min(1, {
                message: "Exercise must include at least 1 character",
            }),
            sets: z.array(
                z.object({
                    reps: numericString("Reps must be a number").min(1, {
                        message: "Sets must include at least 1 rep",
                    }),
                    weight: numericString("Weight must be a number").optional(),
                    duration: numericString(
                        "Duration must be a number"
                    ).optional(),
                })
            ),
        })
    ),
});