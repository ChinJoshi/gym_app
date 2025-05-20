"use server";
import { loginUser } from "@/zod-types";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { checkUnverifiedEmailExists } from "@/db/queries";

export async function signup(
    prevState: string | undefined,
    formData: FormData
) {
    console.log(formData);
    const supabaseClient = await createAdminClient();
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

    const unverifiedEmailUser = await checkUnverifiedEmailExists(
        parsedCredentials.data.email
    );
    if (unverifiedEmailUser.length > 0) {
        console.log("deleting unverified email user");
        const { error } = await supabaseClient.auth.admin.deleteUser(
            unverifiedEmailUser[0].id
        );
        if (error) {
            console.log("error deleting unverified email user");
            console.log(error);
        }
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
