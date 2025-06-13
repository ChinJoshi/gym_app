"use server";
import { emailSchema } from "@/zod-types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resetPassword(prevState: string | undefined, formData: FormData) {
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        email: formData.get("email"),
    }

    const parsedEmail = emailSchema.safeParse(formDataObject);
    if (!parsedEmail.success) {
        // Flatten the Zod error to get a user-friendly message for the UI
        const errorMessage = parsedEmail.error.flatten().fieldErrors;
        const firstError = Object.values(errorMessage)[0]?.[0] ?? "Invalid credentials";
        return { error: firstError };
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`;

    const { error } = await supabaseClient.auth.resetPasswordForEmail(parsedEmail.data.email, {
        redirectTo: redirectTo,
      })
    if (error) {
        console.log("supabase password reset denied:", error);
    }
    redirect("/dashboard");
}
