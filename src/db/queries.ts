import { db } from "@/db/index";
import {
    routines,
    planned_sets,
    planned_exercises,
    exercises,
} from "@/db/schema";
import { users } from "@/db/auth.schema";
import { routineBuilder } from "@/zod_types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { eq, desc, asc, isNull, and } from "drizzle-orm";

export async function createRoutine(
    routine: z.infer<typeof routineBuilder>,
    user_id: string
) {
    console.log("creating routine");
    type routineInsert = typeof routines.$inferInsert;
    type plannedExercisesInsert = typeof planned_exercises.$inferInsert;
    type exerciseInsert = typeof exercises.$inferInsert;
    type plannedSetsInsert = typeof planned_sets.$inferInsert;

    console.log("starting createRoutine db transaction");
    const result = await db.transaction(async (tx) => {
        try {
            const routineId = uuidv4();
            const routineData = {
                name: routine.routine_name,
                user_id: user_id,
                id: routineId,
            } satisfies routineInsert;
            await tx.insert(routines).values(routineData);

            routine.exercises.forEach(async (exercise, exercise_index) => {
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
                    routine_id: routineId,
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

export async function getRoutines(userId: string) {
    const results = await db
        .select()
        .from(routines)
        .where(eq(routines.user_id, userId))
        .orderBy(desc(routines.created_at));
    return results;
}

export async function getPlannedExercises(routineId: string) {
    const results = await db
        .select()
        .from(planned_exercises)
        .where(eq(planned_exercises.routine_id, routineId))
        .leftJoin(exercises, eq(planned_exercises.exercise_id, exercises.id))
        .orderBy(asc(planned_exercises.sort_order));
    return results;
}

export async function checkUnverifiedEmailExists(email: string) {
    const results = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isNull(users.email_confirmed_at)));
    return results;
}
