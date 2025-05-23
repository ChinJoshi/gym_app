"use server";
import { saveSession } from "@/db/queries";
// import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation"
import {z} from "zod"
import {sessionExecution} from "@/zod-types"

//TODO: this action will take in the session form and log it in the db
export default async function endSession(sessionData: z.infer<typeof sessionExecution>, sessionId: string){
    // const supabase = await createClient()
    // const session = await supabase.auth.getSession()
    // const userId = session.data.session!.user.id
    await saveSession(sessionData,sessionId)
    redirect("/dashboard")   
}