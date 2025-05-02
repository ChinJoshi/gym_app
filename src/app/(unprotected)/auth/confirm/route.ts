import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/dashboard";
    // Extract email for potential error redirects
    const email = searchParams.get("email");

    if (token_hash && type) {
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        
        if (!error) {
            console.log("Email verified successfully, redirecting to:", next);
            // redirect user to specified redirect URL or dashboard
            redirect(next);
        } else {
            console.log("Error verifying email:", error);
            
            if (error.code === "otp_expired") {
                console.log("OTP expired, redirecting to verification page");
                // Redirect to verification page with email parameter if available
                if (email) {
                    redirect(`/verify?email=${encodeURIComponent(email)}&error=expired`);
                } else {
                    redirect("/verify?error=expired");
                }
            }
            
            // Other errors
            if (email) {
                redirect(`/verify?email=${encodeURIComponent(email)}&error=${error.code || 'unknown'}`);
            } else {
                redirect(`/verify?error=${error.code || 'unknown'}`);
            }
        }
    }
    
    // If no token_hash or type, redirect to verification page with error
    redirect("/verify?error=invalid_link");
}
