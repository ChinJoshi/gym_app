"use server";
import { endSession as dbEndSession } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation"
import {z} from "zod"
import {planBuilder} from "@/zod-types"
//TODO: this action will take in the session form and log it in the db

export default async function endSession(sessionData: z.infer<typeof planBuilder>){
    const supabase = await createClient()
    const session = await supabase.auth.getSession()
    const userId = session.data.session?.user.id
    await dbEndSession(userId!)
    redirect("/dashboard")   
}