import { z } from "zod";

export const loginUser = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signupUser = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string(),
});
