"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function resendVerification(email: string) {
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error("Error resending verification email:", error);
      return { 
        error: error.message || "Failed to resend verification email"
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error resending verification:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function resendAndRedirect(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (email) {
    await resendVerification(email);
  }
  
  redirect('/login');
}