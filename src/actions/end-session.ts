"use server";
import { endSession as dbEndSession } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation"
//TODO: this action will take in the session form and log it in the db

export async function endSession(formData:FormData){
    const supabase = await createClient()
    const session = await supabase.auth.getSession()
    const userId = session.data.session?.user.id
    await dbEndSession(formData.get("sessionId") as string,userId!)
    redirect("/dashboard")   
}