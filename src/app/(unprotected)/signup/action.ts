"use server";
import { signupUser } from "@/zod_types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(
    prevState: string | undefined,
    formData: FormData
) {
    console.log(formData);
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        // username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    // TODO: inform user of why signup was unsuccesful using error codes from supabase/zod
    const parsedCredentials = signupUser.safeParse(formDataObject);
    if (!parsedCredentials.success) {
        console.log("parsing error: " + parsedCredentials.error.toString());
        return "Signup unsuccessful";
    }
    const { error } = await supabaseClient.auth.signUp(parsedCredentials.data);
    if (error) {
        console.log("supabase auth denied credentials on signup");
        console.log(error);
        return "Signup unsuccessful";
    }
    redirect("/");
}
