import { db } from "@/db/index";
import {
    plans,
    planned_sets,
    planned_exercises,
    exercises,
    sessions,
    session_exercises,
    session_sets,
} from "@/db/schema";
import { users } from "@/db/auth.schema";
import { planBuilder , sessionExecution} from "@/zod-types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, asc, isNull, and, sql, or } from "drizzle-orm";

export async function createPlan(
    plan: z.infer<typeof planBuilder>,
    user_id: string
) {
    console.log("creating plan");
    type planInsert = typeof plans.$inferInsert;
    type plannedExercisesInsert = typeof planned_exercises.$inferInsert;
    type plannedSetsInsert = typeof planned_sets.$inferInsert;

    console.log("starting createPlan db transaction");
    const result = await db.transaction(async (tx) => {
        try {
            const planId = uuidv4();
            const planData = {
                name: plan.plan_name,
                user_id: user_id,
                id: planId,
            } satisfies planInsert;
            await tx.insert(plans).values(planData);

            plan.exercises.forEach(async (exercise, exercise_index) => {
                const plannedExerciseId = uuidv4();
                const plannedExerciseData = {
                    id: plannedExerciseId,
                    plan_id: planId,
                    exercise_id: exercise.exerciseId,
                    sort_order: exercise_index,
                } satisfies plannedExercisesInsert;
                await tx.insert(planned_exercises).values(plannedExerciseData);

                exercise.sets.forEach(async (set, set_index) => {
                    const plannedSetData = {
                        id: uuidv4(),
                        planned_exercise_id: plannedExerciseId,
                        reps: Number(set.reps),
                        weight: set.weight ? Number(set.weight) : null,
                        duration: set.duration ? Number(set.duration) : null,
                        sort_order: set_index,
                    } satisfies plannedSetsInsert;
                    await tx.insert(planned_sets).values(plannedSetData);
                });
            });
            return { success: true };
        } catch (error) {
            tx.rollback();
            console.error(error);
            return { error: error };
        }
    });
    return result;
}

export async function getPlans(userId: string) {
    const results = await db
        .select()
        .from(plans)
        .where(eq(plans.user_id, userId))
        .orderBy(desc(plans.created_at));
    return results;
}

export async function getPlannedExercises(planId: string) {
    const results = await db
        .select()
        .from(planned_exercises)
        .where(eq(planned_exercises.plan_id, planId))
        .leftJoin(exercises, eq(planned_exercises.exercise_id, exercises.id))
        .orderBy(asc(planned_exercises.sort_order));
    return results;
}

export async function getPlannedSets(plannedExerciseId: string) {
    const results = await db
        .select()
        .from(planned_sets)
        .where(eq(planned_sets.planned_exercise_id, plannedExerciseId))
        .orderBy(asc(planned_sets.sort_order));
    return results;
}

export async function checkUnverifiedEmailExists(email: string) {
    const results = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isNull(users.email_confirmed_at)));
    return results;
}

export async function getSessionInProgress(userId: string) {
    const results = await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.user_id, userId), isNull(sessions.completed_at)));
    return results;
}

export async function startSession(planId: string, userId: string) {
    type sessionInsert = typeof sessions.$inferInsert;
    const sessionId = uuidv4();
    const sessionData = {
        id: sessionId,
        user_id: userId,
        plan_id: planId,
    } satisfies sessionInsert;
    await db.insert(sessions).values(sessionData);
    return sessionId;
}

export async function endSession( userId: string){
    await db.update(sessions)
        .set({
            completed_at: sql`NOW()`,
            duration: sql`NOW() - ${sessions.started_at}`
        }).where(eq(sessions.user_id,userId))
}

export async function getPlanFromSessionId(sessionId: string){
    const results = await db.select().from(sessions).where(eq(sessions.id,sessionId)).leftJoin(plans,eq(sessions.plan_id,plans.id)).leftJoin(planned_exercises,eq(planned_exercises.plan_id,plans.id)).leftJoin(exercises,eq(planned_exercises.exercise_id,exercises.id)).leftJoin(planned_sets,eq(planned_sets.planned_exercise_id,planned_exercises.id)).orderBy(asc(planned_exercises.sort_order), asc(planned_sets.sort_order))
    return results
}

export async function saveSession(sessionData: z.infer<typeof sessionExecution>,sessionId:string){
    await db.transaction(async (tx)=>{
        try {
            type sessionExercisesInsert = typeof session_exercises.$inferInsert
            type sessionSetsInsert = typeof session_sets.$inferInsert
            
            sessionData.exercises.forEach(async (exercise, exercise_index) => {
                const sessionExerciseId = uuidv4()
                await tx.insert(session_exercises).values({id: sessionExerciseId,exercise_id:exercise.exerciseId,sort_order:exercise_index,session_id:sessionId} satisfies sessionExercisesInsert)
                exercise.sets.forEach(async (set,set_index) =>{
                    await tx.insert(session_sets).values({sort_order: set_index, reps: Number(set.reps), session_exercise_id:sessionExerciseId, duration: set.duration ? Number(set.duration) : null, weight: set.weight ? Number(set.weight) : null, completed: set.completed === "true" ? true: false} satisfies sessionSetsInsert)
                })
            })

            await db.update(sessions).set({completed_at: sql`NOW()`, duration: sql`NOW() - ${sessions.started_at}`}).where(eq(sessions.id,sessionId))

        }
        catch(error){
            tx.rollback()
            console.log(error)
            return {"error":error}
        }

    })
}

export async function getExercises(userId: string){
    const results = await db.select().from(exercises).where(or(eq(exercises.user_id,userId),eq(exercises.is_custom,false)))
    return results
}

export async function getSessions(userId: string){
    const results = await db.select().from(sessions).where(eq(sessions.user_id,userId)).leftJoin(plans,eq(sessions.plan_id,plans.id))
    return results
}