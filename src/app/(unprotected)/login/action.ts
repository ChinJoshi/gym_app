"use server";
import { loginUser } from "@/zod_types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsedCredentials = loginUser.safeParse(formDataObject);
    if (!parsedCredentials.success) {
        console.log("parsing error: " + parsedCredentials.error.toString());
        return "Login unsuccessful";
    }
    const { error } = await supabaseClient.auth.signInWithPassword(
        parsedCredentials.data
    );
    if (error) {
        console.log("supabase auth denied credentials on login");
        return "Login unsuccessful";
    }
    redirect("/dashboard");
}
