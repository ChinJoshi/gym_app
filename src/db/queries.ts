import { db } from "@/db/index";
import {
    routines,
    planned_sets,
    planned_exercises,
    exercises,
} from "@/db/schema";
import { routineBuilder } from "@/zod_types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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
