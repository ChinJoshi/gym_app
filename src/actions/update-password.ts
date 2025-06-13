"use server";
import { passwordSchema } from "@/zod-types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function updatePassword(
    prevState: string | undefined,
    formData: FormData
) {
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        password: formData.get("password"),
    };

    const parsedPassword = passwordSchema.safeParse(formDataObject);
    if (!parsedPassword.success) {
        // Flatten the Zod error to get a user-friendly message for the UI
        const errorMessage = parsedPassword.error.flatten().fieldErrors;
        const firstError =
            Object.values(errorMessage)[0]?.[0] ?? "Invalid credentials";
        return { error: firstError };
    }

    const { error } = await supabaseClient.auth.updateUser({
        password: parsedPassword.data.password,
    });

    if (error) {
        console.log("supabase password update failed:", error);
    }
    redirect("/dashboard");
}
