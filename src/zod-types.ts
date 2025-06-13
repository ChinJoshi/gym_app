import { z } from "zod";

export const loginUser = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

const numericString = (message: string) => z.string().regex(/^\d*$/, message);
const booleanString = (message: string) => z.string().regex(/^(true|false)$/, message)

export const planBuilder = z.object({
    plan_name: z.string().min(1, {
        message: "Plan name must include at least 1 character",
    }),
    exercises: z.array(
        z.object({
            exercise: z.string().min(1, {
                message: "Exercise must include at least 1 character",
            }),
            exerciseId: z.string(),
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

export const sessionExecution = z.object({
    plan_name: z.string().min(1, {
        message: "Plan name must include at least 1 character",
    }),
    exercises: z.array(
        z.object({
            exercise: z.string().min(1, {
                message: "Exercise must include at least 1 character",
            }),
            exerciseId: z.string(),
            sets: z.array(
                z.object({
                    reps: numericString("Reps must be a number").min(1, {
                        message: "Sets must include at least 1 rep",
                    }),
                    weight: numericString("Weight must be a number").optional(),
                    duration: numericString(
                        "Duration must be a number"
                    ).optional(),
                    completed: booleanString("completed must be  true or false")
                })
            ),
        })
    ),
})

export const exerciseCreator = z.object({
    name: z.string().min(1, {
        message: "Exercise name must include at least 1 character",
    }),
    muscle_group: z.string().optional(),
    equipment: z.string().optional(),
})

export const planEditor = z.object({
    plan_name: z.string().min(1, {
        message: "Plan name must include at least 1 character",
    }),
    exercises: z.array(
        z.object({
            id: z.string(), // planned_exercise id
            exercise: z.string().min(1, {
                message: "Exercise must include at least 1 character",
            }),
            exerciseId: z.string(), // exercise id
            sets: z.array(
                z.object({
                    id: z.string().optional(),
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

export const exerciseEditor = exerciseCreator.extend({});