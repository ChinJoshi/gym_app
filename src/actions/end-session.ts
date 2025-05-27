"use server";
import { saveSession } from "@/db/queries";
// import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation"
import {z} from "zod"
import {sessionExecution} from "@/zod-types"

export default async function endSession(sessionData: z.infer<typeof sessionExecution>, sessionId: string){
    await saveSession(sessionData,sessionId)
    redirect("/dashboard")   
}