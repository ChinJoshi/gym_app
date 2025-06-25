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
import { planBuilder , sessionExecution, exerciseCreator, planEditor} from "@/zod-types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, asc, isNull, and, sql, or, inArray } from "drizzle-orm";

export async function getUserExercises(userId: string) {
    const results = await db
        .select()
        .from(exercises)
        .where(eq(exercises.user_id, userId));
    return results;
}

export async function createExercise(
    exercise: z.infer<typeof exerciseCreator>,
    user_id: string
) {
    type newExercise = typeof exercises.$inferInsert;
    const newExerciseData: newExercise = {
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        equipment: exercise.equipment,
        is_custom: true,
        user_id: user_id,
    };
    await db.insert(exercises).values(newExerciseData);
}

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

            for (const [exercise_index, exercise] of plan.exercises.entries()) {
                const plannedExerciseId = uuidv4();
                const plannedExerciseData = {
                    id: plannedExerciseId,
                    plan_id: planId,
                    exercise_id: exercise.exerciseId,
                    sort_order: exercise_index,
                } satisfies plannedExercisesInsert;
                await tx.insert(planned_exercises).values(plannedExerciseData);

                for (const [set_index, set] of exercise.sets.entries()) {
                    const plannedSetData = {
                        id: uuidv4(),
                        planned_exercise_id: plannedExerciseId,
                        reps: Number(set.reps),
                        weight: set.weight ? Number(set.weight) : null,
                        duration: set.duration ? Number(set.duration) : null,
                        sort_order: set_index,
                    } satisfies plannedSetsInsert;
                    await tx.insert(planned_sets).values(plannedSetData);
                }
            }
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

export async function getPlanFromSessionId(sessionId: string, userId: string){
    const results = await db.select().from(sessions).where(and(eq(sessions.id,sessionId), eq(sessions.user_id, userId))).leftJoin(plans,eq(sessions.plan_id,plans.id)).leftJoin(planned_exercises,eq(planned_exercises.plan_id,plans.id)).leftJoin(exercises,eq(planned_exercises.exercise_id,exercises.id)).leftJoin(planned_sets,eq(planned_sets.planned_exercise_id,planned_exercises.id)).orderBy(asc(planned_exercises.sort_order), asc(planned_sets.sort_order))
    if (results.length === 0) {
        return null; // Or throw an error
    }
    return results
}

export async function saveSession(sessionData: z.infer<typeof sessionExecution>,sessionId:string){
    await db.transaction(async (tx)=>{
        try {
            type sessionExercisesInsert = typeof session_exercises.$inferInsert
            type sessionSetsInsert = typeof session_sets.$inferInsert
            
            for (const [exercise_index, exercise] of sessionData.exercises.entries()) {
                const sessionExerciseId = uuidv4()
                await tx.insert(session_exercises).values({id: sessionExerciseId,exercise_id:exercise.exerciseId,sort_order:exercise_index,session_id:sessionId} satisfies sessionExercisesInsert)
                for (const [set_index, set] of exercise.sets.entries()) {
                    await tx.insert(session_sets).values({sort_order: set_index, reps: Number(set.reps), session_exercise_id:sessionExerciseId, duration: set.duration ? Number(set.duration) : null, weight: set.weight ? Number(set.weight) : null, completed: set.completed === "true" ? true: false} satisfies sessionSetsInsert)
                }
            }

            await db.update(sessions).set({completed_at: sql`NOW()`, duration: sql`NOW() - ${sessions.started_at}`, note:sessionData.note}).where(eq(sessions.id,sessionId))

        }
        catch(error){
            tx.rollback()
            console.log(error)
            return {"error":error}
        }

    })
}

export async function discardSession(sessionId: string,userId:string){
    await db.delete(sessions).where(and(eq(sessions.id,sessionId),eq(sessions.user_id,userId)))
}

export async function getExercises(userId: string){
    const results = await db.select().from(exercises).where(or(eq(exercises.user_id,userId),eq(exercises.is_custom,false)))
    return results
}

export async function getSessions(userId: string){
    const results = await db.select({sessions:sessions,plans:plans,volume:sql<number>`sum(${session_sets.weight} * ${session_sets.reps})` }).from(sessions).where(eq(sessions.user_id,userId)).leftJoin(plans,eq(sessions.plan_id,plans.id)).leftJoin(session_exercises,eq(sessions.id,session_exercises.session_id)).leftJoin(session_sets,eq(session_exercises.id,session_sets.session_exercise_id)).groupBy(sessions.id,plans.id).orderBy(sessions.completed_at)
    return results
}

export async function getSessionVolumesByPlan(planId: string){
    const results = await db.select({volume: sql<number>`sum(${session_sets.weight} * ${session_sets.reps})` }).from(sessions).where(eq(sessions.plan_id,planId)).leftJoin(session_exercises,eq(sessions.id,session_exercises.session_id)).leftJoin(session_sets,eq(session_exercises.id,session_sets.session_exercise_id)).groupBy(sessions.id).orderBy(sessions.completed_at)
    return results
}


export async function getPlanForEdit(planId: string, userId: string) {
    const result = await db
        .select()
        .from(plans)
        .where(and(eq(plans.id, planId), eq(plans.user_id, userId)))
        .leftJoin(
            planned_exercises,
            and(
                eq(planned_exercises.plan_id, plans.id),
                eq(planned_exercises.archived, false)
            )
        )
        .leftJoin(exercises, eq(planned_exercises.exercise_id, exercises.id))
        .leftJoin(
            planned_sets,
            and(
                eq(planned_sets.planned_exercise_id, planned_exercises.id),
                eq(planned_sets.archived, false)
            )
        )
        .orderBy(
            asc(planned_exercises.sort_order),
            asc(planned_sets.sort_order)
        );
    if (result.length === 0) {
        return null;
    }
    return result;
}

export async function updatePlanQuery(
    plan: z.infer<typeof planEditor>,
    planId: string
) {
    return await db.transaction(async (tx) => {
        await tx
            .update(plans)
            .set({ name: plan.plan_name, updated_at: new Date() })
            .where(eq(plans.id, planId));

        const exerciseIdsToKeep: string[] = [];
        const setIdsToKeep: string[] = [];

        for (const [exercise_index, exercise] of plan.exercises.entries()) {
            let plannedExerciseId = exercise.id;
            if (plannedExerciseId.startsWith("new-")) {
                plannedExerciseId = uuidv4();
                await tx.insert(planned_exercises).values({
                    id: plannedExerciseId,
                    plan_id: planId,
                    exercise_id: exercise.exerciseId,
                    sort_order: exercise_index,
                });
            } else {
                await tx
                    .update(planned_exercises)
                    .set({ sort_order: exercise_index })
                    .where(eq(planned_exercises.id, plannedExerciseId));
            }
            exerciseIdsToKeep.push(plannedExerciseId);

            for (const [set_index, set] of exercise.sets.entries()) {
                let plannedSetId = set.id;
                if (!plannedSetId || plannedSetId.startsWith("new-")) {
                    plannedSetId = uuidv4();
                    await tx.insert(planned_sets).values({
                        id: plannedSetId,
                        planned_exercise_id: plannedExerciseId,
                        reps: Number(set.reps),
                        weight: set.weight ? Number(set.weight) : null,
                        duration: set.duration ? Number(set.duration) : null,
                        sort_order: set_index,
                    });
                } else {
                    await tx
                        .update(planned_sets)
                        .set({
                            reps: Number(set.reps),
                            weight: set.weight ? Number(set.weight) : null,
                            duration: set.duration
                                ? Number(set.duration)
                                : null,
                            sort_order: set_index,
                        })
                        .where(eq(planned_sets.id, plannedSetId));
                }
                setIdsToKeep.push(plannedSetId);
            }
        }

        const allDbExercises = await tx.select({id: planned_exercises.id}).from(planned_exercises).where(eq(planned_exercises.plan_id, planId))
        const allDbSets = await tx.select({id: planned_sets.id}).from(planned_sets).leftJoin(planned_exercises, eq(planned_sets.planned_exercise_id, planned_exercises.id)).where(eq(planned_exercises.plan_id, planId))

        const exercisesToArchive = allDbExercises.filter(e => !exerciseIdsToKeep.includes(e.id)).map(e => e.id)
        const setsToArchive = allDbSets.filter(s => !setIdsToKeep.includes(s.id)).map(s => s.id)

        if (exercisesToArchive.length > 0) {
            await tx
                .update(planned_exercises)
                .set({ archived: true })
                .where(inArray(planned_exercises.id, exercisesToArchive));
        }

        if (setsToArchive.length > 0) {
            await tx
                .update(planned_sets)
                .set({ archived: true })
                .where(inArray(planned_sets.id, setsToArchive));
        }
    });
}

export async function getExerciseForEdit(exerciseId: string, userId: string) {
    const result = await db
        .select()
        .from(exercises)
        .where(
            and(
                eq(exercises.id, exerciseId),
                eq(exercises.user_id, userId),
                eq(exercises.is_custom, true)
            )
        );
    if (result.length === 0) {
        return null;
    }
    return result[0];
}
