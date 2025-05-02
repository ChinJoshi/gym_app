"use server";
import { loginUser } from "@/zod_types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(prevState: string | undefined, formData: FormData) {
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsedCredentials = loginUser.safeParse(formDataObject);
    if (!parsedCredentials.success) {
        console.log("parsing error: " + parsedCredentials.error.toString());
        return { error: "Invalid email or password" };
    }
    const { error } = await supabaseClient.auth.signInWithPassword(
        parsedCredentials.data
    );
    if (error) {
        console.log("supabase auth denied credentials on login:", error);
        
        // Check for unverified account error
        if (error.code === "email_not_confirmed") {
            const email = parsedCredentials.data.email;
            console.log("Redirecting unverified user to verification page");
            redirect(`/verify?email=${encodeURIComponent(email)}`);
        }
        
        return { error: "Invalid email or password" };
    }
    redirect("/dashboard");
}
