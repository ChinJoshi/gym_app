import { db } from "@/db/index";
import {
    plans,
    planned_sets,
    planned_exercises,
    exercises,
    sessions,
} from "@/db/schema";
import { users } from "@/db/auth.schema";
import { planBuilder } from "@/zod-types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, asc, isNull, and, sql } from "drizzle-orm";

export async function createPlan(
    plan: z.infer<typeof planBuilder>,
    user_id: string
) {
    console.log("creating plan");
    type planInsert = typeof plans.$inferInsert;
    type plannedExercisesInsert = typeof planned_exercises.$inferInsert;
    type exerciseInsert = typeof exercises.$inferInsert;
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
                const exerciseId = uuidv4();
                const exerciseData = {
                    id: exerciseId,
                    name: exercise.exercise,
                    isCustom: true,
                    user_id: user_id,
                } satisfies exerciseInsert;
                await tx.insert(exercises).values(exerciseData);
                const plannedExerciseId = uuidv4();
                const plannedExerciseData = {
                    id: plannedExerciseId,
                    plan_id: planId,
                    exercise_id: exerciseId,
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

export async function endSession(sessionId: string, userId: string){
    await db.update(sessions)
        .set({
            completed_at: sql`NOW()`,
            duration: sql`NOW() - ${sessions.started_at}`
        }).where(and(eq(sessions.id,sessionId),eq(sessions.user_id,userId)))
}
