"use server";
import { loginUser } from "@/zod_types";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkUnverifiedEmailExists } from "@/db/queries";

export async function signup(
    prevState: string | undefined,
    formData: FormData
) {
    console.log(formData);
    const supabaseClient = await createClient();

    // Convert FormData to a plain object
    const formDataObject = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    // TODO: inform user of why signup was unsuccesful using error codes from supabase/zod
    const parsedCredentials = loginUser.safeParse(formDataObject);
    if (!parsedCredentials.success) {
        console.log("parsing error: " + parsedCredentials.error.toString());
        return { error: "Signup unsuccessful" };
    }

    // problem: when user signs up with wrong email, then another user who acutally has that email signsup, their account is still linked with the old password from the first person
    // solution: if signup occurs for an unverified email, delete the old unverified account and create a new one with the new metadata and password
    const unverifiedEmailUser = await checkUnverifiedEmailExists(
        parsedCredentials.data.email
    );
    if (unverifiedEmailUser.length > 0) {
        console.log("deleting unverified email user");
        const { error } = await supabaseClient.auth.admin.deleteUser(
            unverifiedEmailUser[0].id
        );
    }

    const { error } = await supabaseClient.auth.signUp(parsedCredentials.data);

    if (error) {
        console.log("supabase auth denied credentials on signup");
        console.log(error);
        return { error: "Signup unsuccessful" };
    }
    redirect(
        `/verify?email=${encodeURIComponent(parsedCredentials.data.email)}`
    );
}
