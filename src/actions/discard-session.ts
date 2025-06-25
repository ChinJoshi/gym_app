"use server"
import { discardSession as discardSessionDB } from "@/db/queries"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
export default async function discardSession(sessionId: string){
    const supabase = await createClient()
    const userId = await (await supabase.auth.getSession()).data.session!.user.id
    discardSessionDB(sessionId,userId)
    redirect("/dashboard")
}